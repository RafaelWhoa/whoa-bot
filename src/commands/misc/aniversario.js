// noinspection JSFileReferences

import {SlashCommandBuilder} from 'discord.js'
import {setTimeout} from "timers/promises";
import {Aniversarios} from '../../models/Aniversarios.js';
import {logger} from "../../utils/utils.index.js";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';


dayjs.extend(customParseFormat);

export const aniversarioCommands = {
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
                    .setRequired(true)))
            .addSubcommand(subcommand => subcommand
                .setName('remover')
                .setDescription('Remove um aniversário.')
                .addUserOption(option => option.setName('user')
                    .setDescription('Usuário')
                    .setRequired(true))))
        .addSubcommandGroup(subcommandGroup => subcommandGroup
            .setName('ver')
            .setDescription('Verifica aniversários.')
            .addSubcommand(subcommand => subcommand
                .setName('todos')
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
                    content: locales[interaction.locale][subcommand].errorBirthday, ephemeral: true
                });
                return;
            }
            try {
                const instance = await Aniversarios.findOne({
                    where: {
                        username: target.username, server_id: interaction.guild.id
                    }
                });
                if (instance) {
                    await instance.update({birthday: birthdayFormatted});
                    await instance.save();
                    await interaction.deferReply();
                    await setTimeout(1000);
                    await interaction.editReply('Aniversário adicionado com sucesso!');
                } else {
                    await Aniversarios.create({
                        username: target.username,
                        user_id: target.id,
                        birthday: birthdayFormatted,
                        server_id: interaction.guild.id,
                    });
                    await interaction.deferReply();
                    await setTimeout(1000);
                    await interaction.editReply('Aniversário adicionado com sucesso!');
                }
            } catch (error) {
                logger.error(`Error to add birthday: ${error}`, error);
                await interaction.reply({content: locales[interaction.locale][subcommand].error, ephemeral: true});
            }
        }
        else if(subcommand === 'remover'){
            const target = interaction.options.getUser('user');
            const instance = await Aniversarios.findOne({
                where:{
                    user_id: target.id,
                    server_id: interaction.guild.id
                }
            })
            if(instance){
                await instance.destroy();
                await setTimeout(1000);
                await interaction.reply('Aniversário removido com sucesso!');
            }
            else{
                await interaction.reply('A data do aniversário desse usuário não foi adicionada!');
            }
        }
        else if (subcommand === 'todos') {
            const instances = await Aniversarios.findAll({
                where: {
                    server_id: interaction.guild.id,
                }
            });
            let message = 'Aniversários do servidor:\n';
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
                const instance = await Aniversarios.findOne({where: {user_id: target.id}});
                let message = '';
                const username = instance.dataValues.user_id;
                const birthday = instance.dataValues.birthday;
                const day = dayjs(birthday).format('DD');
                const month = dayjs(birthday).format('MM');
                message += `<@${username}> faz aniversário em ${day}/${month}\n`;
                await interaction.reply(message);
            } catch (error) {
                await interaction.reply({
                    content: 'A data de aniversário desse usuário não foi adicionada!', ephemeral: true
                });
                logger.error(`Error to get birthday: ${error}` + error.message);
            }
        }
    }
}