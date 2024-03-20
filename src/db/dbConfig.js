const {Sequelize} = require('sequelize')

const dbConfig = new Sequelize(process.env.DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: 'localhost',
    dialect: 'postgres',
    })

module.exports.connection = dbConfig;

