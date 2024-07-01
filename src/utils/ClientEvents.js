import {Events} from "discord.js";
import {PatoBans} from "../models/PatoBans.js";
import logger from "../logger.js";
import {Aniversarios} from "../models/Aniversarios.js";
import dotenv from 'dotenv';
import {DiscordServer} from "../models/DiscordServer.js";
import dayjs from "dayjs";

dotenv.config();


export function clientEventsInit(client) {
    client.once(Events.ClientReady, async () => {
        await PatoBans.sync().then(() => {
            logger.info('PatoBans table synced')
        });
        await Aniversarios.sync({force: false}).then(() => {
            logger.info('Aniversarios table synced')
        });
        await DiscordServer.sync({force: false}).then(() => {
            logger.info('DiscordServer table synced')
        });
    })
    client.login(process.env.TOKEN).then(() => {
        logger.info(`Logged in as ${client.user.tag}!`)
    })

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
                await interaction.followUp({
                    content: 'There was an error while executing this command!',
                    ephemeral: true
                });
            } else {
                await interaction.reply({content: 'There was an error while executing this command!', ephemeral: true});
            }
        }
    });

    client.on(Events.GuildCreate, async guild => {
        const [discordServer, created] = await DiscordServer.findOrCreate({
            where: {
                server_id: guild.id
            },
            defaults: {
                server_name: guild.name,
                server_owner_id: guild.ownerId,
                server_member_count: guild.memberCount,
                server_joined_at: guild.joinedAt
            }
        })
        if (!created) {
            await discordServer.update({
                    server_deleted_at: null
                },
                {
                    where: {
                        server_id: guild.id
                    }
                })
            await discordServer.save()
        }
    })

    client.on(Events.GuildDelete, async guild => {
        await DiscordServer.update({
            server_deleted_at: dayjs()
        }, {
            where: {
                server_id: guild.id
            }
        }).then(() => {
            logger.info(`Client removed from server ${guild.id}`) //Remove later
        })
    })
}