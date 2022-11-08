/**
 * @file admin.notification.v1.entity
 * @description defines v1 admin notification entity methods
 * @author Desk Now Dev Team
*/

import { Model, Types } from "mongoose";
import BaseEntity from "../base.entity";
import AdminNotificationModel from "@models/admin.notification.model";
import Builder from "@builders";
import { PushNotification } from "@services";
import { ENUM, ENUM_ARRAY } from "@common";
import { HostV1 } from "./host.v1.entity";
import { UserV1 } from "./user.v1.entity";
import user_sessionsModel from "@models/user_sessions.model";
import host_sessionModel from "@models/host_session.model";
import { rabbitMQController } from "./../../services/rabbitMQ/publisher";

class AdminNotificationEntity extends BaseEntity {
    constructor(model: Model<any>) {
        super(model);
    }

    async createNotification(payload: any): Promise<any> {
        try {
            let updatedPayload = await this.fetchSentCount(payload);
            let newNotification = await new this.model(updatedPayload).save();
            await this.fetchDeviceToken(payload, newNotification);
            return newNotification._id;
        } catch (error) {
            console.error(`we have an error in admin notification entity ==> ${error}`);
            throw error;
        }
    }


    async fetchDeviceToken(payload: any, newNotification?: any): Promise<any> {
        try {
            switch (payload.recipientType) {
                case ENUM.ADMIN.NOTIFICATION.RECIEVER.USERS:
                    await Promise.all([
                        rabbitMQController.publisherToInsertNotificationToAllUserIndb(payload),
                        rabbitMQController.publisherToSendPushToAllUser(payload)
                    ])
                    break;
                case ENUM.ADMIN.NOTIFICATION.RECIEVER.HOSTS:
                    await Promise.all([
                        rabbitMQController.publisherToInsertNotificationToAllHostIndb(payload),
                        rabbitMQController.publisherToSendPushToAllHost(payload)
                    ])
                    break;
                case ENUM.ADMIN.NOTIFICATION.RECIEVER.ALL:
                    await rabbitMQController.publisherToSendPushToAllHost(payload);
                    await rabbitMQController.publisherToInsertNotificationToAllHostIndb(payload);
                    await rabbitMQController.publisherToSendPushToAllUser(payload);
                    await rabbitMQController.publisherToInsertNotificationToAllUserIndb(payload)
                    break;
                case ENUM.ADMIN.NOTIFICATION.RECIEVER.APP:
                    await Promise.all([
                        rabbitMQController.publisherToSendPushToAllHost(payload),
                        rabbitMQController.publisherToInsertNotificationToAllHostIndb(payload),
                        rabbitMQController.publisherToSendPushToAllUser(payload),
                        rabbitMQController.publisherToInsertNotificationToAllUserIndb(payload)
                    ])
                    break;
                case ENUM.ADMIN.NOTIFICATION.RECIEVER.WEB:
                    await Promise.all([
                        rabbitMQController.publisherToSendPushToAllHost(payload),
                        rabbitMQController.publisherToInsertNotificationToAllHostIndb(payload),
                        rabbitMQController.publisherToSendPushToAllUser(payload),
                        rabbitMQController.publisherToInsertNotificationToAllUserIndb(payload)
                    ])
                    break;
                case ENUM.ADMIN.NOTIFICATION.RECIEVER.OTHER:
                    if (payload && payload?.userList.length > 0) {
                        rabbitMQController.publisherToSendPushToAllUser(payload);
                        rabbitMQController.publisherToInsertNotificationToAllUserIndb(payload);
                    }
                    if (payload && payload?.hostList.length > 0) {
                        rabbitMQController.publisherToSendPushToAllHost(payload);
                        rabbitMQController.publisherToInsertNotificationToAllHostIndb(payload);
                    }
                    break;
            }
        } catch (error) {
            console.error(`we have an error ====> ${error}`);
        }
    }

    async fetchNotifications(payload: any): Promise<any> {
        try {
            payload['recipientTypeArray'] = [];
            let pipeline: any = await Builder.Admin.Notification.NotificationList(payload);
            let notificationList = await AdminNotifactionV1.paginateAggregate(pipeline, { limit: payload && payload.limit ? payload.limit = parseInt(payload.limit) : payload.limit = 10, page: payload.page, getCount: true });
            return notificationList;
        } catch (error) {
            console.error(`we have an error in admin notification entity ==> ${error}`);
        }
    }

    async fetchSentCount(payload: any): Promise<any> {
        try {
            switch (payload.recipientType) {
                case ENUM.ADMIN.NOTIFICATION.RECIEVER.USERS:
                    payload['sentCount'] = await user_sessionsModel.countDocuments({
                        isActive: true,
                        notificationEnabled: ENUM_ARRAY.NOTIFICATION.ENABLE
                    })
                    return payload;
                case ENUM.ADMIN.NOTIFICATION.RECIEVER.HOSTS:
                    payload['sentCount'] = await host_sessionModel.countDocuments({
                        isActive: true,
                        notificationEnabled: ENUM_ARRAY.NOTIFICATION.ENABLE
                    })
                    return payload;
                case ENUM.ADMIN.NOTIFICATION.RECIEVER.ALL:
                    let [userCount, hostCount] = await Promise.all([
                        user_sessionsModel.countDocuments({
                            isActive: true,
                            notificationEnabled: ENUM_ARRAY.NOTIFICATION.ENABLE
                        }),
                        host_sessionModel.countDocuments({
                            isActive: true,
                            notificationEnabled: ENUM_ARRAY.NOTIFICATION.ENABLE
                        })
                    ])
                    payload['sentCount'] = userCount + hostCount;
                    return payload;
                case ENUM.ADMIN.NOTIFICATION.RECIEVER.OTHER:
                    const userListCount = payload?.userList ? payload?.userList?.length : 0
                    const hostListCount = payload?.hostList ? payload?.hostList?.length : 0
                    payload['sentCount'] = userListCount + hostListCount;
                    return payload;
            }
        } catch (error) {
            console.error(`we have an error ${error}`);
        }
    }
    async fetchIds(payload: any): Promise<any> {
        try {
            switch (payload.lookupType) {
                case ENUM.ADMIN.LOOKUP_TYPE.HOST_EMAIL_IDS:
                    return await HostV1.findOne({ email: payload.lookupKeys }, { _id: 1 });
                case ENUM.ADMIN.LOOKUP_TYPE.USER_EMAIL_IDS:
                    return await UserV1.findOne({ email: payload.lookupKeys }, { _id: 1 });
                case ENUM.ADMIN.LOOKUP_TYPE.HOST_CONTACT_NUMBER: {
                    const phoneNumber = payload.lookupKeys.split('-')
                    return await HostV1.findOne({ phoneNo: phoneNumber[1], countryCode: phoneNumber[0] }, { _id: 1 });
                }
                case ENUM.ADMIN.LOOKUP_TYPE.USER_CONTACT_NUMBER: {
                    const phoneNumber = payload.lookupKeys.split('-');
                    return await UserV1.findOne({ phoneNo: phoneNumber[1], countryCode: phoneNumber[0] }, { _id: 1 });
                }
                default:
                    break;
            }
        } catch (error) {
            console.error(`we have an error in admin notification entity ==> ${error}`);
        }
    }
    async updateNotificationDetail(payload: any): Promise<any> {
        try {
            let audienceType: any = await this.findOne({ _id: Types.ObjectId(payload.notificationId) });
            let updatedNotificationData = await this.fetchSentCount(audienceType);
            await AdminNotifactionV1.updateOne({ _id: Types.ObjectId(payload._id) }, {
                $inc: { sentCount: updatedNotificationData?.sentCount ? updatedNotificationData?.sentCount : 0 }
            })
            let tokenArray = await this.fetchDeviceToken(audienceType);
            await PushNotification.sendAdminPush(tokenArray, audienceType);
        } catch (error) {
            console.error(`we have an error in admin notification entity ==> ${error}`);
        }
    }
}
export const AdminNotifactionV1 = new AdminNotificationEntity(AdminNotificationModel);