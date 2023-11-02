const {Sequelize} = require('sequelize')

const dbConfig = new Sequelize(process.env.DATABASE, process.env.USER, process.env.PASSWORD, {
    host: 'localhost',
    dialect: 'postgres',
    })

module.exports.connection = dbConfig;

