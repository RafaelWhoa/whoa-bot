const dbConfig = require('../db/dbConfig.js')
const {Sequelize} = require("sequelize");
let dbConnection = dbConfig.connection;

const PatoBans = dbConnection.define('patobans', {
    bansCount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
})

module.exports = PatoBans;