import {SlashCommandBuilder} from "discord.js";
import {SendMessageToQueue} from "../../utils/rabbitmq.js";
import { v4 as uuidv4 } from 'uuid';
import {recieveResponseFromQueue} from "../../utils/reabbitmq_reciever.js";
import {returnFreeChampions, returnFreeChampionsMsgResponse, returnNewPlayerLevelCap} from "../../utils/utils.index.js";

export const lolCommands = {
    data: new SlashCommandBuilder().setName('lol')
        .setDescription('Replies with League of Legends commands')
        .addSubcommand(subcommand => subcommand
            .setName('free-champions')
            .setDescription('Free champion rotations')),

    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        const correlationId = uuidv4();

        if (subcommand === 'free-champions') {
            await interaction.deferReply();
            await SendMessageToQueue('lol-requests', JSON.stringify({
                subcommand: 'free-champions',
                replyTo: 'free-champions-responses',
                channelId: interaction.channelId,
            }))
            const responseMessageFromQueue = await recieveResponseFromQueue('lol-responses');
            const freeChampions = returnFreeChampions(responseMessageFromQueue, false);
            const newPlayerFreeChampions = returnFreeChampions(responseMessageFromQueue, true);
            const newPlayerLevelCap = returnNewPlayerLevelCap(responseMessageFromQueue);
            const responseMessage = returnFreeChampionsMsgResponse(freeChampions, newPlayerFreeChampions, newPlayerLevelCap)
            await interaction.editReply(`${responseMessage}`);
        }
    }
}