import { connect } from 'amqplib';
import {logger} from "./utils.index.js";
import {rabbitmq_connection} from "../config/rabbitmq_connection.js";

export const SendMessageToQueue = async (queue, message) => {
    const amqpConnection = await rabbitmq_connection();

    const channel = await amqpConnection.createChannel();

    await channel.assertQueue(queue, {
        durable: false
    })

    await channel.consume(queue, (message) => {
        logger.info(`Received message from queue ${queue}: ${message.content.toString()}`);
        //responses_controller(message.content.toString(), client);
    }, {
        noAck: true
    });

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));

    setTimeout(function() {
        amqpConnection.close();
    }, 500);
}