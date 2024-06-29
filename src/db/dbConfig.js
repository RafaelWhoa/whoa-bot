import {Sequelize} from "sequelize";

export const sequelize = new Sequelize(process.env.DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: 'db',
    port: 5432,
    dialect: 'postgres',
    })

export default sequelize;

