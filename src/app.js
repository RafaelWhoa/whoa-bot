const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
require('dotenv').config();
const config = require('./config.js')
const logger = require('./logger.js')
const patoBans = require('./models/PatoBans')
const aniversarios = require('./models/Aniversarios')
const schedule = require("node-schedule");
const {GetTodayBirthdays} = require("./utils/birthday");


const client = new Client({intents: [GatewayIntentBits.Guilds]});



client.once(Events.ClientReady, () => {
    patoBans.sync().then(() => {logger.info('PatoBans table synced')});
    aniversarios.sync().then(() => {logger.info('Aniversarios table synced')});
})

client.login(process.env.TOKEN).then(r => {logger.info(`Logged in as ${client.user.tag}!`)})

const commands = [];
client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        // Set a new item in the Collection with the key as the command name and the value as the exported module
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
            commands.push(command.data.toJSON());
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

config.initialConfig(commands, client).then(r => {logger.info('SlashCommands loaded')});

const scheduleBirthdayMessage = schedule.scheduleJob('00 00 * * *', async function () {
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