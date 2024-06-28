import sequelize from '../db/dbConfig.js'
import {DataTypes} from "sequelize";

export const Aniversarios = sequelize.define('aniversarios', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    birthday: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    server_id: {
        type: DataTypes.STRING,
    },
})