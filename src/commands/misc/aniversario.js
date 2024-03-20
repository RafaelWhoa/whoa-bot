const SlashCommandBuilder = require('discord.js').SlashCommandBuilder;
const wait = require('node:timers/promises').setTimeout;
const aniversario = require('../../models/Aniversarios.js');
const logger = require('../../logger.js');
const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');
const {CalculateNextAge} = require('../../utils/birthday.js');
const {where} = require("sequelize");
dayjs.extend(customParseFormat);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('aniversario')
        .setDescription('Informações sobre aniversários!')
        .addSubcommandGroup(subcommandGroup => subcommandGroup
            .setName('config')
            .setDescription('Configurações de aniversários.')
            .addSubcommand(subcommand => subcommand
                .setName('add')
                .setDescription('Adiciona um aniversário.')
                .addUserOption(option => option.setName('user')
                    .setDescription('Usuário')
                    .setRequired(true))
                .addStringOption(option => option.setName('birthday')
                    .setDescription('Data de aniversário (DD/MM/YYYY)')
                    .setRequired(true))))
        .addSubcommandGroup(subcommandGroup => subcommandGroup
            .setName('ver')
            .setDescription('Verifica aniversários.')
            .addSubcommand(subcommand => subcommand
                .setName(
                    'todos')
                .setDescription('Ver todos os aniversários.'))
            .addSubcommand(subcommand => subcommand
                .setName('usuario')
                .setDescription('Ver data do aniversário de um usuário específico.')
                .addUserOption(option => option.setName('user')
                    .setDescription('Usuário que deseja ver a data do aniversário.')
                    .setRequired(true)))),

    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        const locales = {
            "pt-BR": {
                "add": {
                    "success": "Aniversário adicionado com sucesso!",
                    "error": "Erro ao adicionar aniversário!",
                    "errorUser": "Usuário não encontrado!",
                    "errorBirthday": "Data de aniversário inválida!",
                },
            },
        }
        if (subcommand === 'add') {
            const target = interaction.options.getUser('user');
            const birthday = interaction.options.getString('birthday');
            const splittedDate = birthday.split('/'); // Divide a data em partes [dia, mês, ano]
            const day = splittedDate[0];
            const month = splittedDate[1];
            const year = splittedDate[2];
            const birthdayFormatted = `${year}-${month}-${day} 00:00`;
            if (!target) {
                await interaction.reply({content: locales[interaction.locale][subcommand].errorUser, ephemeral: true});
                return;
            }
            if (!dayjs(birthdayFormatted).isValid()) {
                await interaction.reply({
                    content: locales[interaction.locale][subcommand].errorBirthday,
                    ephemeral: true
                });
                return;
            }
            try {
                const instance = await aniversario.findOne({where: {username: target.username}});
                if (instance) {
                    await instance.update({birthday: birthdayFormatted});
                    await instance.save();
                    await interaction.deferReply();
                    await wait(1000);
                    await interaction.editReply('Aniversário adicionado com sucesso!');
                } else {
                    await aniversario.create({
                        username: target.username,
                        user_id: target.id,
                        birthday: birthdayFormatted,
                        server_id: interaction.guild.id,
                    });
                    await interaction.deferReply();
                    await wait(1000);
                    await interaction.editReply('Aniversário adicionado com sucesso!');
                }
            } catch (error) {
                logger.error(`Error to add birthday: ${error}`, error);
                await interaction.reply({content: locales[interaction.locale][subcommand].error, ephemeral: true});
            }
        } else if (subcommand === 'todos') {
            const instances = await aniversario.findAll({
                where: {
                    server_id: interaction.guild.id,
                }
            });
            let message = 'Aniverários dos batatas:\n';
            instances.forEach(instance => {
                const username = instance.dataValues.user_id;
                const birthday = instance.dataValues.birthday;
                const day = dayjs(birthday).format('DD');
                const month = dayjs(birthday).format('MM');
                message += `<@${username}> - ${day}/${month}\n`;
            });
            await interaction.reply(message);
        } else if (subcommand === 'usuario') {
            try {
                const target = interaction.options.getUser('user');
                const instance = await aniversario.findOne({where: {user_id: target.id}});
                let message = '';
                const username = instance.dataValues.user_id;
                const birthday = instance.dataValues.birthday;
                const day = dayjs(birthday).format('DD');
                const month = dayjs(birthday).format('MM');
                const year = dayjs(birthday).format('YYYY');
                message += `<@${username}> irá fazer ${CalculateNextAge(birthday).year() - year} anos em ${day}/${month}/${CalculateNextAge(birthday).year()}\n`;
                await interaction.reply(message);
            } catch (error) {
                await interaction.reply({
                    content: 'A data do aniversário desse usuário não foi adicionada!',
                    ephemeral: true
                });
                logger.error(`Error to get birthday: ${error}`, error);
            }
        }
    }
}