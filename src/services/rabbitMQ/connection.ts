import { rabbitMQConst } from './rabbitMQConst'
import { CONFIG } from '@common'
const amqp = require('amqplib');
import { consumer } from "./consumer"

export let channel: any;
class RabbitMQ {
    async createConnection() {
        try {
            let connection = await amqp.connect(CONFIG.AMQP_URL);
            console.log("rabbitMQ server connected");
            channel = await connection.createChannel();

            channel.assertQueue(rabbitMQConst.PUSH_NOTIFICATION_USER, {
                durable: true
            });
            channel.assertQueue(rabbitMQConst.PUSH_NOTIFICATION_HOST, {
                durable: true
            });
            channel.assertQueue(rabbitMQConst.DATABASE_INSERT_USER, {
                durable: true
            });
            channel.assertQueue(rabbitMQConst.DATABASE_INSERT_HOST, {
                durable: true
            });
            channel.assertQueue(rabbitMQConst.BULK_INSERT_DATABASE, {
                durable: true
            });
            channel.assertQueue(rabbitMQConst.INSERT_BULK_EMPLOYEE, {
                durable: true
            });
            consumer.startConsume();
            channel.prefetch(1);
            return channel;
        } catch (error) {
            console.error(`we have an error connecting rabbitMq ==> ${error}`);
        }
    }

}
export const rabbitMQ = new RabbitMQ();
