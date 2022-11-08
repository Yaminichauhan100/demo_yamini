/**
 * @file admin.v1.entity
 * @description defines v1 admin entity methods
 * @author Desk Now Dev Team
*/

import { Model, Types } from "mongoose";

import BaseEntity from "../base.entity";
import coworkersModel from "@models/coworkers.model";
import { BookingV1 } from "@entity";
import Builder from "@builders";
import { ENUM } from "@common";

class CoworkersEntity extends BaseEntity {

    constructor(model: Model<any>) {
        super(model);
    }

    async createUser(payload: any): Promise<IUser.User> {
        let userData = await new this.model(payload).save();
        return userData.toObject();
    }

    async spaceLimitCheck(bookingId: string) {
        try {
            let { occupancy } = await BookingV1.findOne({ _id: Types.ObjectId(bookingId) }, { occupancy: 1 })
            return await BookingV1.findOne({
                _id: Types.ObjectId(bookingId),
                totalSpaceCapacity: { $lte: occupancy }
            }, { occupancy: 1, totalSpaceCapacity: 1 });
        } catch (error) {
            console.error(`we have an error in spaceLimitCheck ==> ${error}`);
        }
    }

    async fetchUserContactList(payload: any): Promise<any> {
        try {
            payload['getCount'] = true;
            let contactListPipeline = Builder.User.UserPropertyBuilder.coworkerContactListing(payload);
            let paginatedList = await CoworkerV1.paginateAggregate(contactListPipeline, payload);
            return paginatedList;
        } catch (error) {
            console.error(`we have an error ==> ${error}`);
        }
    }

    async checkInCount(params: any) {
        try {
            let pipeline: any = []
            let filterConditions: any = {
                $match: {
                    $and: [
                        { name: { $exists: true } },
                        { name: { $ne: "" } },
                    ]
                }
            };
            if (params && params.propertyId) filterConditions.$match.$and.push({ 'propertyId': Types.ObjectId(params.propertyId) })
            if (params && params.bookingId) filterConditions.$match.$and.push({ 'bookingId': Types.ObjectId(params.bookingId) })
            if (params && params.search) filterConditions.$match.$and.push({
                $or: [
                    { 'bookingNumber': params.search },
                    { 'name': { $regex: params.search, $options: "si" } }
                ]
            })
            pipeline.push(filterConditions);
            pipeline.push({
                '$lookup': {
                    from: 'check_in',
                    "let": { "coworkerId": "$_id" },
                    pipeline: [
                        {
                            '$match': {
                                $expr: {
                                    $and: [
                                        { $eq: ['$coworker._id', "$$coworkerId"] }
                                    ]
                                }
                            }
                        },
                        { $sort: { createdAt: -1 } },
                        { $limit: 1 },
                        { $match: { status: ENUM.CHECKIN_STATUS.IN } },
                        {
                            '$project': {
                                time: 1,
                                date: 1,
                                status: 1
                            }
                        }
                    ],
                    as: 'checkInInfo'
                }
            })
            pipeline.push({
                $unwind:
                {
                    path: "$checkInInfo",
                    preserveNullAndEmptyArrays: false
                }
            })
            pipeline.push({
                $match: { checkInInfo: { $exists: true } }
            })
            pipeline.push({
                $count: "count"
            })
            return await CoworkerV1.basicAggregate(pipeline);
        } catch (error) {
            console.error(`we have an error ==> ${error}`);
            return Promise.reject(error)
        }
    }

    async checkOutCount(params: any) {
        try {
            let pipeline: any = []
            let filterConditions: any = {
                $match: {
                    $and: [
                        { name: { $exists: true } },
                        { name: { $ne: "" } },
                    ]
                }
            };
            if (params && params.propertyId) filterConditions.$match.$and.push({ 'propertyId': Types.ObjectId(params.propertyId) })
            if (params && params.bookingId) filterConditions.$match.$and.push({ 'bookingId': Types.ObjectId(params.bookingId) })
            if (params && params.search) filterConditions.$match.$and.push({
                $or: [
                    { 'bookingNumber': params.search },
                    { 'name': { $regex: params.search, $options: "si" } }
                ]
            })
            pipeline.push(filterConditions);
            pipeline.push({
                '$lookup': {
                    from: 'check_in',
                    "let": { "coworkerId": "$_id" },
                    pipeline: [
                        {
                            '$match': {
                                $expr: {
                                    $and: [
                                        { $eq: ['$coworker._id', "$$coworkerId"] }
                                    ]
                                }
                            }
                        },
                        { $sort: { createdAt: -1 } },
                        { $limit: 1 },
                        { $match: { status: ENUM.CHECKIN_STATUS.OUT } },
                        {
                            '$project': {
                                time: 1,
                                date: 1,
                                status: 1
                            }
                        }
                    ],
                    as: 'checkInInfo'
                }
            })
            pipeline.push({
                $unwind:
                {
                    path: "$checkInInfo",
                    preserveNullAndEmptyArrays: false
                }
            })
            pipeline.push({
                $match: { checkInInfo: { $exists: true } }
            })
            pipeline.push({
                $count: "count"
            })
            return await CoworkerV1.basicAggregate(pipeline);
        } catch (error) {
            console.error(`we have an error ==> ${error}`);
            return Promise.reject(error)
        }
    }

    async allCoworkerCount(params: any) {
        try {
            let pipeline: any = []
            let filterConditions: any = {
                $match: {
                    $and: [
                        { name: { $exists: true } },
                        { name: { $ne: "" } },
                    ]
                }
            };
            if (params && params.propertyId) filterConditions.$match.$and.push({ 'propertyId': Types.ObjectId(params.propertyId) })
            if (params && params.bookingId) filterConditions.$match.$and.push({ 'bookingId': Types.ObjectId(params.bookingId) })
            if (params && params.search) filterConditions.$match.$and.push({
                $or: [
                    { 'bookingNumber': params.search },
                    { 'name': { $regex: params.search, $options: "si" } }
                ]
            })
            pipeline.push(filterConditions);
            pipeline.push({
                '$lookup': {
                    from: 'check_in',
                    "let": { "coworkerId": "$_id" },

                    pipeline: [
                        {
                            '$match': {
                                $and: [
                                    { $expr: { $eq: ['$coworker._id', "$$coworkerId"] } },
                                ]
                            }
                        },
                        { $sort: { createdAt: -1 } },
                        { $limit: 1 },
                        {
                            '$project': {
                                time: 1,
                                "date": 1,
                                status: 1
                            }
                        }
                    ],
                    as: 'checkInInfo'
                }
            })
            pipeline.push({
                $unwind:
                {
                    path: "$checkInInfo",
                    preserveNullAndEmptyArrays: true
                }
            })
            pipeline.push({
                $count: "count"
            })
            return await CoworkerV1.basicAggregate(pipeline);
        } catch (error) {
            console.error(`we have an error ==> ${error}`);
            return Promise.reject(error)
        }
    }

    async searchCowrokerCheckInStatus(params: any) {
        try {
            let pipeline: any = []
            let filterConditions: any = {
                $match: {
                    $and: [
                        { name: { $exists: true } },
                        { name: { $ne: "" } },
                    ]
                }
            };
            if (params && params.propertyId) filterConditions.$match.$and.push({ 'propertyId': Types.ObjectId(params.propertyId) })
            if (params && params.bookingId) filterConditions.$match.$and.push({ 'bookingId': Types.ObjectId(params.bookingId) })
            if (params && params.search) filterConditions.$match.$and.push({
                $or: [
                    { 'bookingNumber': params.search },
                    { 'name': { $regex: params.search, $options: "si" } }
                ]
            })
            pipeline.push(filterConditions);
            if (params && params.status === ENUM.CHECKIN_STATUS.IN || params.status === ENUM.CHECKIN_STATUS.OUT) {
                pipeline.push({
                    '$lookup': {
                        from: 'check_in',
                        "let": { "coworkerId": "$_id" },
                        pipeline: [
                            {
                                '$match': {
                                    $expr: {
                                        $and: [
                                            { $eq: ['$coworker._id', "$$coworkerId"] }
                                        ]
                                    }
                                }
                            },
                            { $sort: { createdAt: -1 } },
                            { $limit: 1 },
                            { $match: { status: params.status } },
                            {
                                '$project': {
                                    time: 1,
                                    date: 1,
                                    status: 1
                                }
                            }
                        ],
                        as: 'checkInInfo'
                    }
                })
            } else {
                pipeline.push({
                    '$lookup': {
                        from: 'check_in',
                        "let": { "coworkerId": "$_id" },

                        pipeline: [
                            {
                                '$match': {
                                    $and: [
                                        { $expr: { $eq: ['$coworker._id', "$$coworkerId"] } },
                                    ]
                                }
                            },
                            { $sort: { createdAt: -1 } },
                            { $limit: 1 },
                            {
                                '$project': {
                                    time: 1,
                                    "date": 1,
                                    status: 1
                                }
                            }
                        ],
                        as: 'checkInInfo'
                    }
                })
            }
            if (params && params.status === ENUM.CHECKIN_STATUS.IN || params.status === ENUM.CHECKIN_STATUS.OUT) {
                pipeline.push({
                    $unwind:
                    {
                        path: "$checkInInfo",
                        preserveNullAndEmptyArrays: false
                    }
                })
                pipeline.push({
                    $match: { checkInInfo: { $exists: true } }
                })
            } else {
                pipeline.push({
                    $unwind:
                    {
                        path: "$checkInInfo",
                        preserveNullAndEmptyArrays: true
                    }
                })
            }
            return await CoworkerV1.paginateAggregate(pipeline, { getCount: true, limit: params && params.limit ? params.limit = parseInt(params.limit) : params.limit = 10, page: params.page });
        } catch (error) {
            console.error(`we have an error ==> ${error}`);
            return Promise.reject(error)
        }
    }

}

export const CoworkerV1 = new CoworkersEntity(coworkersModel);