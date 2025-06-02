import {Sequelize} from "sequelize";
import dotenv from "dotenv";
import path from "path";

const env = process.env.NODE_ENV || 'development';

dotenv.config({path: path.resolve(process.cwd(), `.env.${env}`)});

export const sequelize = new Sequelize(process.env.DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: 'localhost',
    port: 5433,
    dialect: 'postgres',
    })

export default sequelize;

