import dotenv from 'dotenv';
import {initialConfig} from './config.js';
import logger from './logger.js';

dotenv.config();

initialConfig().then(r => {logger.info('SlashCommands loaded')});