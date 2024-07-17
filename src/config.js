import dotenv from 'dotenv';
import {Client, Collection, GatewayIntentBits, REST, Routes} from 'discord.js';
import {logger} from "./utils/utils.index.js";
import {scheduleBirthdayMessage} from "./utils/schedules.js";
import {fileURLToPath} from "url";
import path from "node:path";
import fs from "node:fs";
import {clientEventsInit} from "./utils/ClientEvents.js";
import {recieveResponseFromQueue} from "./utils/reabbitmq_reciever.js";

dotenv.config();

export const initialConfig = async () =>{

    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
    const client = new Client({intents: [GatewayIntentBits.Guilds]});

    try {
        const commands = [];
        client.commands = new Collection();
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const foldersPath = path.join(__dirname, 'commands');
        const commandFolders = fs.readdirSync(foldersPath);

        logger.info(`Started refreshing ${commands.length} application (/) commands.`)

        for (const folder of commandFolders) {
            const commandsPath = path.join(foldersPath, folder);
            const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
            for (const file of commandFiles) {
                const filePath = path.join(commandsPath, file);
                const command = await import(filePath);
                const commandName = command[`${file.substring(0, file.length - 3)}` + 'Commands']
                // Set a new item in the Collection with the key as the command name and the value as the exported module
                if ('data' in commandName && 'execute' in commandName) {
                    client.commands.set(commandName.data.name, commandName);
                    commands.push(commandName.data.toJSON());
                } else {
                    console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
                }
            }
        }

        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands },
        );

        logger.info(`Successfully reloaded ${commands.length} application (/) commands.`)
    }catch (e){
        logger.error(e)
    }

    try{
        await scheduleBirthdayMessage(client);
        logger.info('Birthday schedule job loaded')
    }
    catch (e){
        logger.error(e)
    }

    try{
        clientEventsInit(client);
    }
    catch (e) {
        logger.error(e)
    }
}