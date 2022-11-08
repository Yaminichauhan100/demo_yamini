
import user_sessionsModel from "@models/user_sessions.model";
import host_sessions from "@models/host_session.model";
import { channel } from "./connection"
import { rabbitMQConst } from './rabbitMQConst'
import { CONSTANT, ENUM, ENUM_ARRAY } from '@common'
import { toObjectId } from "@services";
import AllCityV3 from "@models/allCities.model";

class RabbitMQController {

    async publisherToSendPushToAllUser(payload: any) {
        try {
            let pubArray: any = [];
            let batchSize = CONSTANT.NOTIFICATION_BATCH_SIZE;
            let criteria: any = [];
            let matchCriteria: any = {
                $match: {
                    $and: [
                        { "isActive": true },
                        { "notificationEnabled": ENUM_ARRAY.NOTIFICATION.ENABLE }
                    ]
                }
            };
            matchCriteria.$match.$and.push({ 'isActive': true, });
            if (payload && payload?.userList?.length > 0) matchCriteria.$match.$and.push({ 'userId': { $in: await toObjectId(payload.userList) } });
            if (payload && payload.recipientType == ENUM.ADMIN.NOTIFICATION.RECIEVER.APP) matchCriteria.$match.$and.push({ 'device.type': { $ne: 3 } });
            if (payload && payload.recipientType == ENUM.ADMIN.NOTIFICATION.RECIEVER.WEB) matchCriteria.$match.$and.push({ 'device.type': { $eq: 3 } });
            criteria.push(matchCriteria);
            criteria.push({
                $group: {
                    _id: '$device.token',
                }
            })
            let stream = user_sessionsModel.aggregate(criteria).cursor({ batchSize: batchSize }).exec();
            let count = 0;
            let subArray: any = []
            console.log(count)
            stream.on('data', async function (doc: any) {
                doc && doc._id ? subArray.push(doc._id) : ''
                count++;
                if (subArray && subArray.length == batchSize) {
                    channel.sendToQueue(rabbitMQConst.PUSH_NOTIFICATION_USER, Buffer.from(JSON.stringify({ token: subArray, payload: payload })));
                    pubArray = pubArray.concat(subArray)
                    count = 0
                    subArray = []
                }

            })
            stream.on('end', async function (doc: any) {
                doc && doc._id ? subArray.push(doc._id) : ''
                if (subArray && subArray.length > 0) {
                    channel.sendToQueue(rabbitMQConst.PUSH_NOTIFICATION_USER, Buffer.from(JSON.stringify({ token: subArray, payload: payload })));
                    return {}
                }
                return
            });
        } catch (error) {
            console.error(`we have an error ==> ${error}`);
        }
    }

    async publisherToInsertNotificationToAllUserIndb(notificationData: any) {
        try {
            let pubArray: any = [];
            let batchSize = CONSTANT.NOTIFICATION_BATCH_SIZE;
            let criteria: any = [];
            let matchCriteria: any = {
                $match: {
                    $and: [
                        { "isActive": true },
                        { "notificationEnabled": ENUM_ARRAY.NOTIFICATION.ENABLE }
                    ]
                }
            };
            matchCriteria.$match.$and.push({ 'isActive': true, });
            if (notificationData && notificationData?.userList?.length > 0) matchCriteria.$match.$and.push({ 'userId': { $in: await toObjectId(notificationData.userList) } });
            if (notificationData && notificationData.recipientType == ENUM.ADMIN.NOTIFICATION.RECIEVER.APP) matchCriteria.$match.$and.push({ 'device.type': { $ne: 3 } });
            if (notificationData && notificationData.recipientType == ENUM.ADMIN.NOTIFICATION.RECIEVER.WEB) matchCriteria.$match.$and.push({ 'device.type': { $eq: 3 } });
            criteria.push(matchCriteria);
            criteria.push({
                $group: {
                    _id: {
                        receiverId: '$userId',
                        type: { $literal: 4 },
                        title: { $literal: notificationData.title },
                        message: { $literal: notificationData.description },
                        image: { $literal: notificationData.image },
                        status: { $literal: 'active' },
                        isRead: { $literal: false },
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                }
            });
            criteria.push({ $replaceRoot: { newRoot: "$_id" } });
            let stream = user_sessionsModel.aggregate(criteria).cursor({ batchSize: batchSize }).exec()
            let count = 0
            let subArray: any = []
            console.log(count)
            stream.on('data', async function (doc: any) {
                subArray.push(doc)
                count++;
                if (subArray && subArray.length == batchSize) {
                    await channel.sendToQueue(rabbitMQConst.DATABASE_INSERT_USER, Buffer.from(JSON.stringify(subArray)));
                    pubArray = pubArray.concat(subArray);
                    count = 0;
                    subArray = [];
                }
            })
            stream.on('end', async function (doc: any) {
                if (subArray && subArray.length > 0) {
                    await channel.sendToQueue(rabbitMQConst.DATABASE_INSERT_USER, Buffer.from(JSON.stringify(subArray)));
                    return {};
                }
                return;
            });
        } catch (error) {
            console.error(`we have an error ==> ${error}`);
        }
    }

    async publisherToSendPushToAllHost(payload: any) {
        try {
            let pubArray: any = [];
            let batchSize = CONSTANT.NOTIFICATION_BATCH_SIZE;
            let criteria: any = [];
            let matchCriteria: any = {
                $match: {
                    $and: [
                        { "isActive": true },
                        { "notificationEnabled": ENUM_ARRAY.NOTIFICATION.ENABLE }
                    ]
                }
            };
            matchCriteria.$match.$and.push({ 'isActive': true, });
            if (payload && payload?.hostList?.length > 0) matchCriteria.$match.$and.push({ 'userId': { $in: await toObjectId(payload.hostList) } });
            if (payload && payload.recipientType == ENUM.ADMIN.NOTIFICATION.RECIEVER.APP) matchCriteria.$match.$and.push({ 'device.type': { $ne: 3 } });
            if (payload && payload.recipientType == ENUM.ADMIN.NOTIFICATION.RECIEVER.WEB) matchCriteria.$match.$and.push({ 'device.type': { $eq: 3 } });
            criteria.push(matchCriteria);
            criteria.push({
                $group: {
                    _id: '$device.token',
                }
            })
            let stream = await host_sessions.aggregate(criteria).cursor({ batchSize: batchSize }).exec();
            let count = 0;
            let subArray: any = []
            console.log(count)
            stream.on('data', async function (doc: any) {
                doc && doc._id ? subArray.push(doc._id) : ''
                count++;
                if (subArray && subArray.length == batchSize) {
                    await channel.sendToQueue(rabbitMQConst.PUSH_NOTIFICATION_HOST, Buffer.from(JSON.stringify({ token: subArray, payload: payload })));
                    pubArray = pubArray.concat(subArray)
                    count = 0
                    subArray = []
                }

            })
            stream.on('end', async function (doc: any) {
                doc && doc._id ? subArray.push(doc._id) : ''
                if (subArray && subArray.length > 0) {
                    await channel.sendToQueue(rabbitMQConst.PUSH_NOTIFICATION_HOST, Buffer.from(JSON.stringify({ token: subArray, payload: payload })));
                    return {};
                }
                return;
            })
        } catch (error) {
            console.error(`we have an error ==> ${error}`);
        }
    }

    async publisherToInsertNotificationToAllHostIndb(notificationData: any) {
        try {
            let pubArray: any = [];
            let batchSize = CONSTANT.NOTIFICATION_BATCH_SIZE;
            let criteria: any = [];
            let matchCriteria: any = {
                $match: {
                    $and: [
                        { "isActive": true },
                        { "notificationEnabled": ENUM_ARRAY.NOTIFICATION.ENABLE }
                    ]
                }
            };
            matchCriteria.$match.$and.push({ 'isActive': true, });
            if (notificationData && notificationData?.hostList?.length > 0) matchCriteria.$match.$and.push({ 'userId': { $in: await toObjectId(notificationData.hostList) } });
            criteria.push(matchCriteria);
            criteria.push({
                $group: {
                    _id: {
                        receiverId: '$userId',
                        type: { $literal: 4 },
                        title: { $literal: notificationData.title },
                        message: { $literal: notificationData.description },
                        image: { $literal: notificationData.image },
                        status: { $literal: 'active' },
                        isRead: { $literal: false },
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                }
            })
            criteria.push({ $replaceRoot: { newRoot: "$_id" } })
            let stream = host_sessions.aggregate(criteria).cursor({ batchSize: batchSize }).exec()
            let count = 0
            let subArray: any = [];
            console.log(count);
            stream.on('data', async function (doc: any) {
                subArray.push(doc)
                count++;
                if (subArray && subArray.length == batchSize) {
                    channel.sendToQueue(rabbitMQConst.DATABASE_INSERT_HOST, Buffer.from(JSON.stringify(subArray)))
                    pubArray = pubArray.concat(subArray)
                    count = 0
                    subArray = []
                }
            })
            stream.on('end', async function (doc: any) {
                if (subArray && subArray.length > 0) {
                    channel.sendToQueue(rabbitMQConst.DATABASE_INSERT_HOST, Buffer.from(JSON.stringify(subArray)))
                    return {};
                }
                return;
            })
        } catch (error) {
            console.error(`we have an error ==> ${error}`);
        }
    }

    async publisherToInsertAllCitiesIndb(notificationData: any) {
        try {
            let pubArray: any = [];
            let batchSize = 20000;
            let criteria: any = [
                {
                    '$lookup': {
                        from: 'countries',
                        let: { countryId: "$country_id" },
                        "pipeline": [
                            {
                                '$match': {
                                    $expr: {
                                        $and: [
                                            { $eq: ['$id', '$$countryId'] }
                                        ]
                                    }
                                }
                            }
                        ],
                        as: 'countryData'
                    }
                },
                {
                    '$unwind': '$countryData'
                },
                {
                    '$lookup': {
                        from: 'states',
                        let: { stateId: "$state_id" },
                        pipeline: [
                            {
                                '$match': {
                                    $expr: {
                                        $and: [
                                            { $eq: ['$id', '$$stateId'] }
                                        ]
                                    }
                                }
                            }
                        ],
                        as: 'stateData'
                    }
                },
                {
                    '$unwind': '$stateData'
                },
                {
                    '$project': {
                        _id: 0,
                        isFeatured: {
                            '$literal': false
                        },
                        status: {
                            '$literal': 'inActive'
                        },
                        isDelete: {
                            '$literal': false
                        },
                        countryId: '$country_id',
                        stateId: '$state_id',
                        cityName: '$name',
                        countryName: '$countryData.name',
                        stateName: '$stateData.name'
                    }
                }
            ];
            let stream = await AllCityV3.aggregate(criteria).cursor({ batchSize: batchSize }).exec();
            let count = 0;
            console.log(count);
            let subArray: any = [];
            stream.on('data', async function (doc: any) {
                try {
                    subArray.push(doc);
                    count++;
                    if (subArray && subArray.length === batchSize) {
                        channel.sendToQueue(rabbitMQConst.BULK_INSERT_DATABASE, Buffer.from(JSON.stringify(subArray)));
                        pubArray = pubArray.concat(subArray);
                        count = 0;
                        subArray = [];
                    }
                } catch (error) {
                    console.error(`we have an error ==> ${error}`);
                }
            })
            stream.on('end', async function (doc: any) {
                if (subArray && subArray.length > 0) {
                    channel.sendToQueue(rabbitMQConst.BULK_INSERT_DATABASE, Buffer.from(JSON.stringify(subArray)))
                    return {};
                }
                return;
            })
        } catch (error) {
            console.error(`we have an error ==> ${error}`);
        }
    }

    async publisherToInsertBulkEmployee(fileData: any, partnerId: any) {
        try {
            // console.log("....======>>>>>>> employee sheet", fileData)
            // for(let i=0;i<fileData.length;i++){
            //     console.log("isnide")
            //     console.log("type of", typeof fileData[i].phoneNo)
            //     if(fileData[i].phoneNo.length >14 || fileData[i].phoneNo.length < 8 || fileData[i].phoneNo.toString()[0] === '0')
            //     return
            // }
            channel.sendToQueue(rabbitMQConst.INSERT_BULK_EMPLOYEE, Buffer.from(JSON.stringify({ fileData: fileData, partnerId: partnerId })))
            return
        } catch (error) {
            console.log("error in send que for bulk insert:-", error);
        }
    }
}
export const rabbitMQController = new RabbitMQController();