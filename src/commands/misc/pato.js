import {SlashCommandBuilder} from 'discord.js'
import {setTimeout} from "timers/promises";
import {PatoBans} from '../../models/PatoBans.js'
import logger from '../../logger.js'

async function incrementCounter() {
    try {
        const instance = await PatoBans.findOne();

        if (instance) {
            let counter = instance.dataValues.bansCount;
            await instance.update({bansCount: counter + 1});
            await instance.save();
            return instance.dataValues.bansCount;
        }
        else{
            await PatoBans.create({bansCount: 1});
            return 1;
        }
    } catch (error) {
        logger.error(`Error to increment counter: ${error}`, error);
    }
}

export const patoCommands = {
    data: new SlashCommandBuilder()
        .setName('pato')
        .setDescription('Ban no pato!'),
    async execute(interaction) {
        const counter = await incrementCounter();
        const locales = {
            "pt-BR": `Pato foi banido ${counter} vezes!`,
        }
        await interaction.deferReply();
        await setTimeout(1000);
        await interaction.editReply(locales[interaction.locale] ?? `Pato has been banned ${counter} times!`);
    }
}