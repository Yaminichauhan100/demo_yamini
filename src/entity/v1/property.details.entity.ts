/**
 * @file property.v1.entity
 * @description defines v1 property entity methods
 * @created 2020-04-02 11:27:06
 * @author Desk Now Dev Team
*/

import { Model, Types } from "mongoose";
import BaseEntity from "../base.entity";
import CompanyModel from "@models/properties.model";
import Builder from "@builders";
import { RatingV1 } from "./rating.v1.entity";
import { BASE, DATABASE, DeepLink, RESPONSE, ENUM } from "@common";
import { BookingCartV1, BookingV1, PropertySpaceV1 } from "@entity";
import { handleEntityResponse } from "@baseController";
import { UserAnalyticsV1 } from "./userAnalytics.v1.entity";
import { PromotionV1 } from "./host.promotions.v1.entity";
import { PartnerV1 } from "./partner.v1.entity";
import { NextFunction } from "express";
class PropertyDetailEntity extends BaseEntity {

    constructor(model: Model<any>) {
        super(model);
    }

    async postUpdatePropertyDocument(addPropertyResponse: any): Promise<void> {
        try {
            console.log("error inside here =>>>>>>>>>>>>>>>>>>>>")
            DeepLink({ type: 1, shareId: addPropertyResponse._id });
            let url = `${BASE.URL}/api/user/deeplink/?shareId=${addPropertyResponse._id.toString()}&type=1`
            PropertyV1.updateEntity({ _id: addPropertyResponse._id }, { shareUrl: url });
        } catch (error) {
            console.error(`we have an error while post update property doc ==> ${error}`);
        }
    }

    async patchHostDetail(hostDetail: any, payload: any): Promise<any> {
        try {
            const hostDetailToSave = {
                name: hostDetail.name,
                userId: hostDetail._id,
                image: hostDetail.image,
                email: hostDetail.email,
                fbUrl: hostDetail?.fbUrl,
                instaUrl: hostDetail?.instaUrl,
                twitterUrl: hostDetail?.twitterUrl,
                youtubeUrl: hostDetail?.youtubeUrl,
                linkedinUrl: hostDetail?.linkedinUrl
            }

            payload['userData'] = hostDetailToSave;

            if (payload?.addressPrimary && payload?.addressSecondary) {
                payload['address'] = payload?.addressPrimary + ', ' + payload?.addressSecondary + ', ' + payload?.city?.cityName + ', ' + payload?.state?.name + ', ' + payload?.country?.name
            } else {
                payload['address'] = payload?.addressPrimary + ', ' + payload?.city?.cityName + ', ' + payload?.state?.name + ', ' + payload?.country?.name
            }
            return payload;
        } catch (error) {
            console.error(`we have an error while updating payload in batch ==> ${error}`);
        }
    }


    /**
     * creates a new user
     * @param payload - user data to insert
     */
    async saveProperty(payload: any): Promise<any> {
        try {
            const propertyDetail = await new this.model(payload).save();
            return propertyDetail;
        } catch (error) {
            console.error(`we have an error ==> ${error}`);
        }
    }

    async updateProperty(payload: any, id: any): Promise<any> {
        try {
            return await this.updateDocument({ '_id': Types.ObjectId(id) }, payload);
        } catch (error) {
            console.error(`we have an error in update property ==> ${error}`);
            return Promise.reject(error);
        }
    }


    /**
     * @description method to fetch property details by property id
     * @param id 
     */
    async fetchPropertyDetails(payload: string) {
        try {
            let pipeline = Builder.User.UserPropertyBuilder.userPropertyDetails(payload)
            let details: any = await PropertyV1.basicAggregate(pipeline);
            return details;
        } catch (error) {
            console.error(`we have an error while fetching property detail => ${error}`);
            return Promise.reject(error);
        }
    }

    /**
    * @description method to fetch property details by property id
    * @param id 
    */
    async fetchProperties(payload: string) {
        try {
            let pipeline = Builder.User.UserPropertyBuilder.propertyDetails(payload)
            let details: any = await PropertyV1.basicAggregate(pipeline);
            return details;
        } catch (error) {
            console.error(`we have an error while fetching property detail => ${error}`);
            return Promise.reject(error);
        }
    }

    async updateAnalytics(payload: any, hostId: any) {
        try {
            await UserAnalyticsV1.updateOne({ userId: Types.ObjectId(payload.userId), propertyId: Types.ObjectId(payload.propertyId) },
                {
                    userId: payload.userId,
                    hostId: hostId,
                    propertyId: payload.id,
                    $inc: { viewCount: 1 }
                },
                { upsert: true, new: true }
            )
            await PromotionV1.updateAdAnalytics(payload?.propertyId);
        } catch (err) {

        }
    }
    /**
    * @description method to fetch property details by property id
    * @param id 
    */
    async updateAverageRatingAndCount(payload: string) {
        try {
            let pipeline = Builder.User.UserPropertyBuilder.propertyAvergeRating(payload)
            let details: any = await RatingV1.basicAggregate(pipeline);
            return details;
        } catch (error) {
            console.error(`we have an error while fetching property detail => ${error}`);
            return Promise.reject(error);
        }
    }

    async getPropertyCount(payload: any) {
        let pipeline: any = [];
        let matchCriteria: any = []
        matchCriteria.push({ 'status': 'active' });
        if (payload.fromDate) matchCriteria.push({ createdAt: { $gte: new Date(payload.fromDate) } })
        if (payload.toDate) matchCriteria.push({ createdAt: { $lte: new Date(payload.toDate) } })
        pipeline.push({ $match: { $and: matchCriteria } })
        pipeline.push(
            { $group: { _id: null, count: { $sum: 1 } } },
            { $project: { _id: 0 } }
        )
        let details: any = await PropertyV1.basicAggregate(pipeline);
        details && details.length > 0 ? details = details[0] : details = { count: 0 }
        return details.count;
    }


    async getHolidayList(payload: any) {
        let pipeline: any = [];
        let matchCriteria: any = []
        matchCriteria.push({ "_id": Types.ObjectId(payload.propertyId) })
        pipeline.push({
            $match: {
                $and: [
                    { "_id": Types.ObjectId(payload.propertyId) },
                    {
                        holidays: {
                            $elemMatch: { fromDate: { $lte: DATABASE.DATE_CONSTANTS.fromDate(payload.fromDate, payload.offset) } }
                        }
                    },
                    {
                        holidays: {
                            $elemMatch: { toDate: { $gte: DATABASE.DATE_CONSTANTS.toDate(payload.fromDate, payload.offset) } }
                        }
                    }
                ]
            }
        })
        pipeline.push(
            {
                $unwind:
                {
                    path: "$holidays",
                }
            },
            {
                $project: {
                    propertyId: '$_id',
                    _id: '$holidays._id',
                    name: '$holidays.name',
                    createdAt: '$holidays.createdAt',
                    fromDate: '$holidays.fromDate',
                    toDate: '$holidays.toDate',
                }
            }
        )
        let details: any = await PropertyV1.basicAggregate(pipeline);
        return details;
    }

    /**
     * @description extension of controller updateProperty
     * @param property 
     * @param payload 
     * @param headers 
     * @param res 
     */
    async validateAndUpdateProperty(property: any, payload: any, headers: any, res: any, next: NextFunction): Promise<any> {
        try {
            if ((property.userId).toString() == (payload.userId).toString()) {
                const propertyData = await this.formatUpdatePropertyPayload(payload, property);
                const updatedPropertyResponse = await PropertyV1.updateProperty(payload, payload.id);
                await this.updateFloorsInPromises(propertyData, updatedPropertyResponse, payload, res, headers, next);
                return handleEntityResponse.sendResponse(res, RESPONSE.PROPERTY(res.locals.lang).PROPERTY_UPDATED);
            } else return handleEntityResponse.sendResponse(res, RESPONSE.PROPERTY(res.locals.lang).NOT_AUTHRIZED);
        } catch (error) {
            console.error(`we have an error in validateAndUpdateProperty ==> ${error}`);
            next(error);
        }
    }

    /**
     * @description batch update floors and background updates
     * @param propertyData property model detail
     * @param updatedPropertyResponse 
     * @param payload 
     * @param res 
     * @param headers 
     */
    async updateFloorsInPromises(propertyData: any, updatedPropertyResponse: any, payload: any, res: any, headers: any, next: NextFunction) {
        try {
            await Promise.all([
                PropertySpaceV1.updateFloors(updatedPropertyResponse, payload, res, headers, next),
                BookingCartV1.updateEntity({ "propertyData.propertyId": Types.ObjectId(payload.id) }, { "propertyData": propertyData }, { multi: true }),
                BookingV1.updateEntity({ "propertyData.propertyId": Types.ObjectId(payload.id) }, { "propertyData": propertyData }, { multi: true })
            ]);
        } catch (error) {
            console.error(`we have an error in updateFloorsInPromises ==> ${error}`);
            next(error);
        }
    }

    /**
     * @description format payload to update in property model
     * @param payload req.body
     * @param property model detail
     */
    async formatUpdatePropertyPayload(payload: any, property: any): Promise<any> {
        try {
            console.log("==>>>>>>>>>>>>> user data", property.userData)
            let propertyData: any = {
                status: property.status,
                propertyId: property._id,
                name: property.name,
                address: property?.address,
                images: property.images,
                autoAcceptUpcomingBooking: property.autoAcceptUpcomingBooking,
                hostName: property?.userData?.name,
                hostImage: property?.userData?.image,
                hostEmail: property?.userData?.email
            }
 
            console.log(".............============>>>>>>>>>>> property data",propertyData )
            if (payload.images) propertyData['images'] = payload.images;

            if (payload?.addressPrimary && payload?.addressSecondary) {
                payload['address'] = payload?.addressPrimary + ', ' + payload?.addressSecondary + ', ' + payload?.city?.cityName + ', ' + payload?.state?.name + ', ' + payload?.country?.name;
            } else {
                payload['address'] = payload?.addressPrimary + ', ' + payload?.city?.cityName + ', ' + payload?.state?.name + ', ' + payload?.country?.name;
            }
            if (payload.name) {
                propertyData['name'] = payload['name'];
                Promise.all([
                    PropertySpaceV1.updateEntity(
                        { propertyId: Types.ObjectId(payload.id) },
                        { propertyName: payload.name }, { multi: true }),
                    PartnerV1.updateEntity(
                        { "property._id": Types.ObjectId(payload.id) },
                        { "property.name": payload.name }, { multi: true })
                ])

            }
            return propertyData;
        } catch (error) {
            console.error(`we have an error in formatUpdatePropertyPayload ==> ${error}`);
        }
    }

    async handlePayload(payload: any): Promise<any> {
        try {
            if (!payload?.name) { delete payload.name };
            if (!payload?.addressPrimary) { delete payload.addressPrimary };
            if (!payload?.addressSecondary) { delete payload.addressSecondary };
            if (!payload?.zipCode) { delete payload.zipCode };
            if (!payload?.images) { delete payload.images };
            if (!payload?.heading) { delete payload.heading };
            if (!payload?.description) { delete payload.description };
            if (!payload?.amenities) { delete payload.amenities };
            if (!payload?.address) { delete payload.address };
            if (!payload?.country?._id) { delete payload.country };
            if (!payload?.state?._id) { delete payload.state };
            if (!payload?.city?._id) { delete payload.city };
            if (!payload?.location?.coordinates) { delete payload.location };
            if (!payload?.propertyType) { delete payload.propertyType };
            if (!payload?.termsAndCond) { delete payload.termsAndCond };
            if (payload?.floorDetails?.length <= 0) { delete payload.floorDetails };
            if (!payload?.status) { delete payload.status };
            if (!payload?.propertyId) { delete payload.propertyId };
            if (!payload?.totalUnits) { delete payload.totalUnits };
            if (payload?.location) { payload.location.type = "Point" };
            if (!payload?.capacity) { delete payload?.capacity };
            return payload;
        } catch (error) {
            console.error(`we have an error in handlePayload ==> ${error}`);
        }
    }

    async fetchPropertyListingForOffline(payload: any) {
        try {
            let pipeline: any = []
            let bookingTypeFilterCondition: any = {};

            switch (payload.bookingType) {
                case ENUM.USER.BOOKING_TYPE.HOURLY:
                    bookingTypeFilterCondition = { $eq: ["$bookingType", ENUM.USER.BOOKING_TYPE.HOURLY] };
                    break;
                case ENUM.USER.BOOKING_TYPE.MONTHLY:
                    bookingTypeFilterCondition = { $eq: ["$bookingType", ENUM.USER.BOOKING_TYPE.MONTHLY] };
                    break;
                case ENUM.USER.BOOKING_TYPE.CUSTOM:
                    bookingTypeFilterCondition = { $eq: ["$bookingType", ENUM.USER.BOOKING_TYPE.CUSTOM] };
                    break;
            }
            pipeline.push({
                $match: {
                    $and: [{ userId: Types.ObjectId(payload.userId) },
                    { _id: { $nin: payload.holidayProperties } },
                    { status: ENUM.PROPERTY.STATUS.ACTIVE }]
                },
            })
            pipeline.push({
                "$lookup": {
                    "from": "propertySpace",
                    "let": { "propertyId": "$_id" },
                    "pipeline": [
                        {
                            '$match': {
                                $expr: {
                                    $and: [
                                        { $eq: ['$propertyId', '$$propertyId'] },
                                        { $eq: ["$status", 'active'] },
                                        {
                                            '$eq': [
                                              '$isEmployee',
                                              false
                                            ]
                                          },
                                        bookingTypeFilterCondition ? bookingTypeFilterCondition : bookingTypeFilterCondition = {}
                                    ]
                                }
                            }
                        },
                        { $project: { "categoryName": "$category.name", units: 1, pricing: 1, "categoryId": "$category._id", "capacity": "$capacity", "subCategoryName": "$subCategory.name" } }
                    ],
                    "as": "spaceDetails"
                }
            })
            pipeline.push({ $match: { spaceDetails: { $ne: [] } } })
            pipeline.push({
                $project: {
                    _id: 1, address: 1, name: 1
                }
            })
            return await PropertyV1.basicAggregate(pipeline);
        } catch (error) {
            console.error(`we have an error while fetching property detail => ${error}`);
            return Promise.reject(error);
        }
    }

}

export const PropertyV1 = new PropertyDetailEntity(CompanyModel);