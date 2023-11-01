const SlashCommandBuilder = require('discord.js').SlashCommandBuilder;
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pato')
        .setDescription('Ban no pato!'),
    async execute(interaction) {
        const locales = {
            "pt-BR": "Pato foi banido!",
        }
        await interaction.deferReply();
        await wait(1000);
        await interaction.editReply(locales[interaction.locale] ?? "Pato has been banned!");
    }
}