/**
 * @file notification.v1.entity
 * @description defines v1  entity methods
 * @author Desk Now Dev Team
*/

import { Model, Types } from "mongoose";

import BaseEntity from "../base.entity";
import { CONSTANT } from "@common";
import notificationModel from "@models/notification.model";

class NotificationEntity extends BaseEntity {

    constructor(model: Model<any>) {
        super(model);
    }

    async createNotification(payload: any): Promise<any> {
        try {
            await new this.model(payload).save();
            // return notificationData.toObject();
        } catch (error) {
            console.error(`we have an error while creating notification ===> ${error}`);
        }
    };

    

    async getNotificationListing({ ...params }): Promise<any> {
        try {
            let pipeline: Array<object> = [];
            let matchCriteria: any = { $match: { $and: [] } }
            matchCriteria.$match.$and.push({ 'status': CONSTANT.STATUS.ACTIVE });
            matchCriteria.$match.$and.push({ receiverId: Types.ObjectId(params.userId) });
            pipeline.push(matchCriteria);
            pipeline.push({ $sort: { createdAt: -1 } });
            pipeline.push(
                {
                    "$project": {
                        status: 0
                    }
                })
            return pipeline;
        } catch (error) {
            console.error(`we have an error ===> ${error}`);
        }
    }
}

export const NotificationV1 = new NotificationEntity(notificationModel);