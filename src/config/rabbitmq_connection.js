import {connect} from "amqplib";

export const rabbitmq_connection = async () => {
    return await connect('amqp://' + process.env.RABBITMQ_HOST);
}