import {DataTypes} from "sequelize";
import sequelize from '../db/dbConfig.js'


export const DiscordServer = sequelize.define('discord_server', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
    },
    server_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    server_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    server_owner_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    server_member_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    server_joined_at: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    server_birthday_channel: {
        type: DataTypes.STRING,
    }
})