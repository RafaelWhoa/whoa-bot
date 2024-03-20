const dbConfig = require('../db/dbConfig.js')
const {Sequelize, DataTypes} = require("sequelize");
let dbConnection = dbConfig.connection;

const Aniversarios = dbConnection.define('aniversarios', {
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

module.exports = Aniversarios;