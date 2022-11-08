/**
 * @file admin.v1.entity
 * @description defines v1 admin entity methods
 * @author Desk Now Dev Team
*/

import { Model } from "mongoose";
import BaseEntity from "../base.entity";
import CheckInModel from "@models/checkIn.model";
import { DATABASE, ENUM } from "@common";
import { toObjectId } from "@services";

class CheckInEntity extends BaseEntity {
    constructor(model: Model<any>) {
        super(model);
    }

    async create(payload: any) {
        try {
            let create = await new this.model(payload).save();
            return create;
        } catch (error) {
            console.error(`we have an error ==> ${error}`);
            return Promise.reject(error)
        }
    }

    async searchCheckInUser(params: any) {
        try {
            let pipeline: any = []
            let filterConditions: any = { $match: { $and: [] } };
            if (params && params.status == ENUM.CHECKIN_STATUS.IN) filterConditions.$match.$and.push({ 'status': ENUM.CHECKIN_STATUS.IN })
            if (params && params.status == ENUM.CHECKIN_STATUS.OUT) filterConditions.$match.$and.push({ 'status': ENUM.CHECKIN_STATUS.OUT })
            if (params && params.propertyId) {
                params.propertyId = params.propertyId.split(",")
                filterConditions.$match.$and.push({ 'property._id': { $in: await toObjectId(params.propertyId) } })
            }
            if (params && params.bookingId) filterConditions.$match.$and.push({ 'bookingNo': { $regex: params.bookingId, $options: "si" } })
            filterConditions.$match.$and.push({ bookingId: { $exists: true } })
            if (params && params.country) filterConditions.$match.$and.push({ 'property.country.id': params.country });
            if (params && params.city) filterConditions.$match.$and.push({ 'property.city._id': params.city });
            if (params && params.state) filterConditions.$match.$and.push({ 'property.state.id': params.state });
            if (params && params.search) filterConditions.$match.$and.push({ 'coworker.name': { $regex: params.search, $options: "si" } });
            if (params.fromDate) filterConditions.$match.$and.push({
                "date": {
                    $gte: DATABASE.DATE_CONSTANTS.fromDate(params.fromDate, params.offset)
                }
            })
            if (params.toDate) filterConditions.$match.$and.push({
                "date":
                    { $lte: DATABASE.DATE_CONSTANTS.toDate(params.toDate, params.offset) }
            })
            pipeline.push(filterConditions);
            pipeline.push({ $project: { property: 0 } });
            pipeline.push({ $sort: { createdAt: -1 } });
            return await CheckInV1.paginateAggregate(pipeline, { getCount: true, limit: params && params.limit ? params.limit = parseInt(params.limit) : params.limit = 10, page: params.page });

        } catch (error) {
            console.error(`we have an error ==> ${error}`);
            return Promise.reject(error)
        }
    }



}
export const CheckInV1 = new CheckInEntity(CheckInModel);