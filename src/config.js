require('dotenv').config();
const { REST, Routes } = require('discord.js');
const logger = require('./logger.js');

module.exports.initialConfig = async (commands) =>{

    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

    try {
        logger.info(`Started refreshing ${commands.length} application (/) commands.`)

        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands },
        );

        logger.info(`Successfully reloaded ${commands.length} application (/) commands.`)
    }catch (e){
        logger.error(e)
    }
}