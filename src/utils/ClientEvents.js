import {Events} from "discord.js";
import {PatoBans} from "../models/PatoBans.js";
import logger from "../logger.js";
import {Aniversarios} from "../models/Aniversarios.js";
import dotenv from 'dotenv';
import {DiscordServer} from "../models/DiscordServer.js";

dotenv.config();


export function clientEventsInit(client){
    client.once(Events.ClientReady, async () => {
        await PatoBans.sync().then(() => {
            logger.info('PatoBans table synced')
        });
        await Aniversarios.sync({force: true}).then(() => {
            logger.info('Aniversarios table synced')
        });
    })
    client.login(process.env.TOKEN).then(() => {logger.info(`Logged in as ${client.user.tag}!`)})

    client.on(Events.InteractionCreate, async interaction => {
        if (!interaction.isChatInputCommand()) return;
        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            logger.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            logger.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
            } else {
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        }
    });

    client.on(Events.GuildCreate, async guild => {
        DiscordServer.create({
            server_id: guild.id,
            server_name: guild.name,
            server_owner_id: guild.ownerId,
            server_member_count: guild.memberCount,
            server_joined_at: guild.joinedAt,
        }).then(() => {
            logger.info(`Server ${guild.id} added to the database`) //Remove later
        })
    })
}