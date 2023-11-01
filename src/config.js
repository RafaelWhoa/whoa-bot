require('dotenv').config();
const { REST, Routes } = require('discord.js');

module.exports.initialConfig = async () =>{
    const commands = [
        {
            name: 'ping',
            description: 'Replies with Pong!',
        },
        {
            name: 'pato',
            description: 'Ban no pato!',
        }
    ]

    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

    try {
        console.log('Started refreshing application (/) commands.')

        await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands })

        console.log('Successfully reloaded application (/) commands.')
    }catch (e){
        console.error(e)
    }
}