import sequelize from '../db/dbConfig.js'
import {DataTypes} from "sequelize";

export const PatoBans = sequelize.define('patobans', {
    bansCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
})