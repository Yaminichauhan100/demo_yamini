
import { channel } from "./connection";
import { rabbitMQConst } from './rabbitMQConst'
import notification from "@models/notification.model";
import { PushNotification } from "@services"
import { CityV1, PartnerV1 } from "@entity";
class Consumer {

    async startConsume() {

        channel.consume(rabbitMQConst.PUSH_NOTIFICATION_USER, async function (msg: any) {
            try {
                if (msg.content) {
                    let payload = msg.content.toString()
                    payload = JSON.parse(payload)
                    console.log(`${rabbitMQConst.PUSH_NOTIFICATION_USER}`, payload)
                    await PushNotification.sendAdminPush(payload.token, payload.payload)
                    await timer(msg, 1000)
                    channel.ack(msg)
                }
                return
            } catch (error) {
                console.log(`${rabbitMQConst.PUSH_NOTIFICATION_USER}`, error)
                return {}
            }
        }, { noAck: false });


        channel.consume(rabbitMQConst.PUSH_NOTIFICATION_HOST, async function (msg: any) {
            try {
                if (msg.content) {
                    let payload = msg.content.toString()
                    payload = JSON.parse(payload)
                    await PushNotification.sendAdminPush(payload.token, payload.payload)
                    await timer(msg, 1000)
                    channel.ack(msg)

                }
                return
            } catch (error) {
                console.log(`${rabbitMQConst.PUSH_NOTIFICATION_HOST}`, error)
                return {}
            }
        }, { noAck: false });

        channel.consume(rabbitMQConst.DATABASE_INSERT_HOST, async function (msg: any) {
            try {
                if (msg.content) {
                    var payload: any = msg.content.toString()
                    console.log(payload)
                    let array = JSON.parse(payload);
                    console.log(`${rabbitMQConst.DATABASE_INSERT_HOST}`, array)
                    await notification.insertMany(array);
                    await timer(msg, 1000)
                    channel.ack(msg)
                }
                return
            } catch (error) {
                console.log(`${rabbitMQConst.DATABASE_INSERT_HOST}`, error)
                return {}
            }

        }, { noAck: false });

        channel.consume(rabbitMQConst.DATABASE_INSERT_USER, async function (msg: any) {
            try {
                if (msg.content) {
                    var payload: any = msg.content.toString()
                    console.log(payload)
                    let array = JSON.parse(payload);
                    console.log(`${rabbitMQConst.DATABASE_INSERT_HOST}`, array)
                    await notification.insertMany(array)
                    await timer(msg, 1000)
                    channel.ack(msg)
                }
                return
            } catch (error) {
                console.log(`${rabbitMQConst.DATABASE_INSERT_HOST}`, error)
                return {}
            }

        }, { noAck: false });

        channel.consume(rabbitMQConst.BULK_INSERT_DATABASE, async function (msg: any) {
            try {
                if (msg.content) {
                    var payload: any = msg.content.toString()
                    console.log(payload)
                    let array = JSON.parse(payload);
                    console.log(`${rabbitMQConst.BULK_INSERT_DATABASE}`, array)
                    CityV1.insertMany(array)
                    await timer(msg, 1000);
                    channel.ack(msg);
                }
                return;
            } catch (error) {
                console.log(`${rabbitMQConst.BULK_INSERT_DATABASE}`, error);
                return {}
            }
        }, { noAck: false });


        channel.consume(rabbitMQConst.INSERT_BULK_EMPLOYEE, async function (msg: any) {
            try {
                if (msg.content) {
                    var payload: any = msg.content.toString()
                    let array = JSON.parse(payload);
                    console.log("arrayarrayarrayarrayarray", array);
                    await PartnerV1.bulkEmployee(array.fileData, array.partnerId)
                    await timer(msg, 1000)
                    channel.ack(msg)
                }
                return;
            } catch (error) {
                console.log(`${rabbitMQConst.BULK_INSERT_DATABASE}`, error);
                return {}
            }
        }, { noAck: false });
    }
}
export const consumer = new Consumer();

export let timer = (msg: any, time: number) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({});
        }, time)
    })
}