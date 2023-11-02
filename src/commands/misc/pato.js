const SlashCommandBuilder = require('discord.js').SlashCommandBuilder;
const wait = require('node:timers/promises').setTimeout;
const patoBans = require('../../models/PatoBans.js');
const logger = require('../../logger.js');

async function incrementCounter() {
    try {
        const instance = await patoBans.findOne();

        if (instance) {
            let counter = instance.dataValues.bansCount;
            await instance.update({bansCount: counter + 1});
            await instance.save();
            return counter;
        }
    } catch (error) {
        logger.error(`Error to increment counter: ${error}`, error);
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pato')
        .setDescription('Ban no pato!'),
    async execute(interaction) {
        const counter = await incrementCounter();
        const locales = {
            "pt-BR": `Pato foi banido ${counter} vezes!`,
        }
        await interaction.deferReply();
        await wait(1000);
        await interaction.editReply(locales[interaction.locale] ?? `Pato has been banned ${counter} times!`);
    }
}