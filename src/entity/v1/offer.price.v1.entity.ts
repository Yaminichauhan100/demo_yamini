/**
 * @file offer.v1.entity
 * @description defines v1 offer entity methods
 * @author Desk Now Dev Team
*/

import { Model, Types } from "mongoose";
import BaseEntity from "../base.entity";
import OfferModel from "@models/offerPrice.model";
import { redisDOA } from "@services";
import { DATABASE } from "@common";


class OPriceEntity extends BaseEntity {

    constructor(model: Model<any>) {
        super(model);
    }

    async saveMultipleOfferPrice(offerDataArray: any, spaceId: string, propertyId: string, offset: any): Promise<any> {
        try {
            offerDataArray.forEach(async (obj: any, index: number) => {
                obj['startDate'] = DATABASE.DATE_CONSTANTS.fromDate(obj.startDate, offset);
                obj['endDate'] = DATABASE.DATE_CONSTANTS.toDate(obj.endDate, offset);
                obj['spaceId'] = spaceId;
                obj['propertyId'] = propertyId;
                if (offerDataArray.length - 1 == index) { return await this.insertMany(offerDataArray); }
            });
        } catch (error) {
            console.error(`we have an error in saving saveMultipleOfferPrice ==> ${error}`);
        }
    };

    async updateMultipleOfferPrice(offerDataArray: any, spaceData: any, propertyId: string, offset: any): Promise<any> {
        try {
            await OPriceV1.removeAll({ spaceId: spaceData });
            offerDataArray.forEach(async (obj: any, index: number) => {
                obj['startDate'] = DATABASE.DATE_CONSTANTS.fromDate(obj.startDate, offset);
                obj['endDate'] = DATABASE.DATE_CONSTANTS.toDate(obj.endDate, offset);
                obj['spaceId'] = spaceData;
                obj['propertyId'] = propertyId;
                if (offerDataArray.length - 1 == index) return await this.insertMany(offerDataArray)
            })
            return;
        } catch (error) {
            console.error(`we have an error in updateMultipleOfferPrice ==> ${error}`);
        }
    };

    /**
     * @deprecated
     */
    async addDynamicPriceLabels(labelArray: any): Promise<any> {
        try {
            return await redisDOA.insertKeyInRedisHash(DATABASE.REDIS.KEY_NAMES.APP_CONFIG, DATABASE.REDIS.KEY_NAMES.DYNAMIC_PRICE_LABEL, labelArray);
        } catch (error) {
            throw error;
        }
    };
    /**
     * @deprecated
     */
    async getPriceLabels(): Promise<any> {
        try {
            return await redisDOA.getKeyFromRedisHash(DATABASE.REDIS.KEY_NAMES.APP_CONFIG, DATABASE.REDIS.KEY_NAMES.DYNAMIC_PRICE_LABEL);
        } catch (error) {
            throw error;
        }
    };

    async validateRedundantSeason(payload: any, spaceId: string): Promise<any> {
        try {
            // !! Step1 --> check 1 if offer exists for this space.
            // !! Step2 --> if exists check for redundancy that might be single {} or [more].
            // !! Step3 --> if redundant return season already exists return false! else return true;
            const seasonExistenceCheck = await this.findMany({
                spaceId: Types.ObjectId(spaceId),
                startDate: { $gte: new Date(payload.startDate) },
                endDate: { $gte: new Date(payload.endDate) }
            });
            return seasonExistenceCheck;
        } catch (error) {
            console.error(`we have an error while validating redundant season ==> ${error}`);
        }
    }
}
export const OPriceV1 = new OPriceEntity(OfferModel);