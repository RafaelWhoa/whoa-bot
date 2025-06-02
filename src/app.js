import dotenv from 'dotenv';
import {initialConfig} from './config.js';
import logger from './logger.js';
import path from "path";

const env = process.env.NODE_ENV || 'development';

dotenv.config({path: path.resolve(process.cwd(), `.env.${env}`)});

initialConfig().then(r => {logger.info('SlashCommands loaded')});