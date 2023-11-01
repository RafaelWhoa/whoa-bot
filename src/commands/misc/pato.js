const SlashCommandBuilder = require('discord.js').SlashCommandBuilder;
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pato')
        .setDescription('Ban no pato!'),
    async execute(interaction) {
        await interaction.deferReply();
        await wait(4000);
        await interaction.editReply('Pato foi banido!');
    }
}