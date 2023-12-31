import "dotenv/config.js";
import {Client, GatewayIntentBits} from "discord.js";


const client = new Client({intents: [GatewayIntentBits.Guilds]});

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
})

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'ping'){
        await interaction.reply('Pong!');
    }
})
client.login(process.env.TOKEN)