/**
 * @file promotions.v1.entity
 * @description defines v1 promotions entity methods
 * @created 2019-08-25 23:24:06
 * @author Desk Now Dev Team
*/

import { Model } from "mongoose";
import BaseEntity from "../base.entity";
import PromotionModel from "@models/host.promotion.model";
import { ENUM } from "@common";
import moment from "moment";
import { Types } from "mongoose";
import { PropertyV1 } from "@entity";
import { calculateDiffInSeconds, redisDOA } from "@services";

class HostPromotionEntity extends BaseEntity {


    constructor(model: Model<any>) {
        super(model);
    }

    async createPromotionEntity(payload: any) {
        try {
            return await this.createOne(payload);
        } catch (error) {
            console.error(`we have an error ==> ${error}`);
            throw error;
        }
    }

    async endPromotion(promotionId: any) {
        try {
            await this.updateDocument({ _id: Types.ObjectId(promotionId) }, { promotionStatus: ENUM.PROPERTY.PROMOTION_STATUS.EXPIRED });
        } catch (error) {
            console.error(`we have an error ==> ${error}`);
        }
    }

    async startPromotion(promotionId: any) {
        try {
            let promotionDetail: any = await this.updateDocument({ _id: Types.ObjectId(promotionId) }, { promotionStatus: ENUM.PROPERTY.PROMOTION_STATUS.ONGOING });
            const expireTime = calculateDiffInSeconds(promotionDetail?.fromDate, false, promotionDetail?.toDate);
            await redisDOA.setKey(`${ENUM.PROPERTY.PROMOTION_FLAG.END}_${promotionDetail?._id}`, promotionDetail?.fromDate);
            await redisDOA.expireKey(`${ENUM.PROPERTY.PROMOTION_FLAG.END}_${promotionDetail?._id}`, expireTime);
        } catch (error) {
            console.error(`we have an error ==> ${error}`);
        }
    }

    async checkSlotAvailability(payload: any) {
        try {
            let flag = true;
            // match listingType
            // match if slotType exists 
            // then fromDate and ToDate inBetween check
            // if data is there return flag =false
            return flag;
        } catch (error) {
            console.error(`we have an error ==> ${error}`);
            throw error;
        }
    }

    async updateAdAnalytics(propertyId: string, userId?: string) {
        try {
            let pipeline: any = [];
            let filterConditions: any = { $match: { $and: [] } };
            pipeline.push(
                {
                    $match: {
                        "status": ENUM.PROPERTY.STATUS.ACTIVE,
                        _id: Types.ObjectId(propertyId)
                    }
                },
                {
                    '$lookup': {
                        from: 'promotions',
                        let: {
                            propertyId: '$_id'
                        },
                        pipeline: [
                            {
                                '$match': {
                                    '$expr': {
                                        '$and': [
                                            {
                                                '$eq': [
                                                    '$propertyId',
                                                    '$$propertyId'
                                                ]
                                            },
                                            {
                                                '$eq': [
                                                    '$promotionStatus',
                                                    0
                                                ]
                                            },
                                            {
                                                '$eq': [
                                                    '$listingType',
                                                    1
                                                ]
                                            }
                                        ]
                                    }
                                }
                            },
                            { $limit: 3 },
                            { $project: { slotType: 1 } }
                        ],
                        as: 'promotions'
                    }
                },
                {
                    $unwind: {
                        path: "$promotions",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    "$lookup": {
                        "from": "propertySpace",
                        "let": { "propertyId": "$_id" },
                        "pipeline": [
                            {
                                '$match': {
                                    $expr: {
                                        $and: [
                                            { $eq: ['$propertyId', '$$propertyId'] },
                                            { $eq: ["$status", 'active'] }
                                        ]
                                    }
                                }
                            },
                            { $project: { "categoryName": "$category.name", pricing: 1, "categoryId": "$category._id", "capacity": "$capacity", "subCategoryName": "$subCategory.name" } }
                        ],
                        "as": "spaceDetails"
                    }
                }
            );
            filterConditions.$match.$and.push({ 'spaceDetails': { $ne: [] } })
            pipeline.push(
                { '$project': { promotions: 1 } }
            )
            let propertyResponse = await PropertyV1.basicAggregate(pipeline);
            if (propertyResponse[0]?.promotions) {
                await PromotionV1.update({ _id: Types.ObjectId(propertyResponse[0]?.promotions?._id) }, {
                    $inc: {
                        "analytics.viewCount": 1
                    },
                });
            }
        } catch (error) {
            console.error(`we have an error while updating analytics ==> ${error}`);
        }
    }

    async calculateDates(duration: any, offset: number) {
        try {
            switch (duration) {
                case ENUM.PROPERTY.PROMOTION.DURATION.DAILY:
                    {
                        const today = moment().endOf('day').subtract(offset, "minute").toDate();
                        let response: any = {};
                        response['fromDate'] = today;
                        response['toDate'] = moment(today).endOf('day').add(1, 'd').subtract(offset, "minute").toDate();
                        return response;
                    }
                case ENUM.PROPERTY.PROMOTION.DURATION.WEEKLY:
                    {
                        const today = moment().endOf('day').subtract(offset, "minute").toDate();
                        let response: any = {};
                        response['fromDate'] = today;
                        response['toDate'] = moment(today).endOf('day').add(1, 'w').subtract(offset, "minute").toDate();
                        return response;
                    }
                case ENUM.PROPERTY.PROMOTION.DURATION.MONTHLY:
                    {
                        const today = moment().endOf('day').subtract(offset, "minute").toDate();
                        let response: any = {};
                        response['fromDate'] = today;
                        response['toDate'] = moment(today).endOf('day').add(1, 'M').subtract(offset, "minute").toDate();
                        return response;
                    }
            }
        } catch (error) {
            console.error(`we have an error ==> ${error}`);
            throw error;
        }
    }
}

export const PromotionV1 = new HostPromotionEntity(PromotionModel);