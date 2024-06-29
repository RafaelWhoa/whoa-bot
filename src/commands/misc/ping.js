import {SlashCommandBuilder} from 'discord.js'
import {setTimeout} from 'timers/promises'

export const pingCommands = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    async execute(interaction) {
        await interaction.deferReply();
        await setTimeout(4000);
        await interaction.editReply('Pong!');
    }
}