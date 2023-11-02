const dbConfig = require('../db/dbConfig.js')
const {Sequelize} = require("sequelize");
let dbConnection = dbConfig.connection;

const Aniversarios = dbConnection.define('aniversarios', {
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    birthday: {
        type: Sequelize.DATE,
        allowNull: false,
    },
})

module.exports = Aniversarios;