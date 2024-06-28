import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'url';
import { Client, Collection, Events, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import {initialConfig} from './config.js';
import logger from './logger.js';
import {PatoBans} from './models/PatoBans.js';
import {Aniversarios} from './models/Aniversarios.js';
import schedule from 'node-schedule';
import {GetTodayBirthdays} from './utils/birthday.js';

dotenv.config();


const client = new Client({intents: [GatewayIntentBits.Guilds]});



client.once(Events.ClientReady, () => {
    PatoBans.sync().then(() => {logger.info('PatoBans table synced')});
    Aniversarios.sync({force: false}).then(() => {logger.info('Aniversarios table synced')});
})

client.login(process.env.TOKEN).then(r => {logger.info(`Logged in as ${client.user.tag}!`)})

const commands = [];
client.commands = new Collection();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

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

initialConfig(commands, client).then(r => {logger.info('SlashCommands loaded')});

const scheduleBirthdayMessage = schedule.scheduleJob('57 09 * * *', async function () {
    await GetTodayBirthdays(client);
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
            await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
        } else {
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
});