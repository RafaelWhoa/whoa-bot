import dotenv from 'dotenv';
import {logger} from "./utils.index.js";
import {rabbitmq_connection} from "../config/rabbitmq_connection.js";

dotenv.config();

export const recieveResponseFromQueue = async (queue) => {
    const amqpConnection = await rabbitmq_connection();

    const channel = await amqpConnection.createChannel();

    await channel.assertQueue(queue, {
        durable: false
    });

    return new Promise((resolve, reject) => {
        channel.consume(queue, (message) => {
            if (message !== null) {
                logger.info(`Received message from queue ${queue}: ${message.content.toString()}`);
                resolve(message.content.toString());
            } else {
                reject(new Error('No message received'));
            }
        }, {
            noAck: true
        });

        setTimeout(function() {
            amqpConnection.close();
            reject(new Error('Timeout while waiting for message'));
        }, 5000);
    });
}