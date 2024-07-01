import {Sequelize} from "sequelize";
import dotenv from "dotenv";

dotenv.config();

export const sequelize = new Sequelize(process.env.DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: 'db',
    port: 5432,
    dialect: 'postgres',
    })

export default sequelize;

