/**
 * @file host.v1.entity
 * @description defines v1 host entity methods
 * @created 2020-04-02 11:27:06
 * @author Desk Now Dev Team
*/

import { Model, Types } from "mongoose";
import BaseEntity from "../base.entity";
import { Auth } from "../../services/auth.service"
import { CONSTANT, DATABASE, ENUM, ENUM_ARRAY, RESPONSE } from "@common"
import { redisDOA } from "@services"
import { BookingV1, PropertySpaceV1, PropertyV1 } from "@entity";
import hostModel from "@models/host.model";
import host_sessionModel from "@models/host_session.model";
import { PaymentController } from "@controllers";
import { PartnerFloorV1 } from "./partner.floor.entity";
import { handleEntityResponse } from "@baseController";
import { NextFunction } from "express";
class HostEntity extends BaseEntity {

    constructor(model: Model<any>) {
        super(model);
    }

    /**
     * creates a new user
     * @param payload - user data to insert
     */
    async createUser(payload: any): Promise<IUser.User> {

        payload.password = Auth.hashData(payload.password, CONSTANT.PASSWORD_HASH_SALT)
        let userData = await new this.model(payload).save();
        let dataToInsertInRedis = {
            "userId": userData._id.toString(),
            "email": payload.email,
            "phoneNo": payload.phone
        }
        await redisDOA.insertKeyInRedis("users", JSON.stringify(dataToInsertInRedis))
        return userData.toObject();
    }


    async updateHostToken(hostId: string, deviceToken: string): Promise<any> {
        try {
            return await host_sessionModel.updateOne({ userId: Types.ObjectId(hostId), isActive: true },
                {
                    $set: { 'device.token': deviceToken }
                })
        } catch (error) {
            console.error(`we have an error in updatingDeviceToken ==> ${error}`);
        }
    }

    /**
     * creates a new user
     * @param payload - user data to insert
     */
    async createUserNew(payload: IUser.Request.CreateUser): Promise<IUser.User> {
        let adminData = await new this.model(payload).save();
        return adminData.toObject();
    }

    async fetchHostDeviceToken(hostId: string): Promise<any> {
        try {
            return await host_sessionModel.distinct("device.token", {
                userId: Types.ObjectId(hostId),
                isActive: true,
                notificationEnabled: ENUM_ARRAY.NOTIFICATION.ENABLE
            })
        } catch (error) {
            console.error(`we have an error ==> ${error}`);
        }
    }
    /**
     * filters user data for safe response
     * @params userData
     */
    filterUserData(userData: IUser.User): IUser.User {
        return userData;
    }

    /**
     * creates a new session for user, removes previous session
     * @params payload - user session data payload
     * @todo-action uncomment remove previous sessions for single login
     */
    async createNewSession(payload: any): Promise<IUser.UserSession> {
        payload.userId = Types.ObjectId(payload.userId);
        let sessionData: any = await new host_sessionModel(payload).save();
        return sessionData.toObject();
    }

    /**
     * removes all previous session of user
     * @params payload - user session data payload
     */
    async removePreviousSession(id: Types.ObjectId, multi: Boolean): Promise<any> {
        if (multi) await host_sessionModel.remove({ userId: id, isActive: true });
        else await host_sessionModel.remove({ _id: id });
    }

    /**
     * removes all previous session of user
     * @params payload - user session data payload
     */
    async removeSession(id: Types.ObjectId): Promise<void> {
        await host_sessionModel.updateMany({ _id: id }, { isActive: false });
    }

    /**
     * blocks the user
     * @param userId
     * @param actionDir `true` to block, `false` to unblock
    */
    async blockUser(userId: IUser.User['_id'], actionDir: boolean) {
        userId = Types.ObjectId(userId);
        let updatedUser = await this.updateEntity<IUser.User>(
            { _id: userId },
            {
                isActive: !actionDir,
                status: actionDir ? ENUM.USER.STATUS.BLOCK : ENUM.USER.STATUS.ACTIVE
            }
        );
        if (updatedUser.data) {
            if (actionDir) await this.removePreviousSession(userId, true);
            return { success: true };
        }
        else return { success: false }
    }

    /**
     * get all user device tokens
     */
    async getAllUserTokens(payload: any) {
        let matchCondition: any = { 'device.token': { $exists: true, $ne: '' }, status: ENUM.USER.STATUS.ACTIVE, };
        if (payload.usersList) matchCondition['_id'] = { $in: payload.usersList };
        let userData = await this.basicAggregate(
            [
                { $match: matchCondition },
                { $group: { _id: null, tokens: { $push: '$device.token' } } }
            ]
        );
        if (userData.length) return userData[0].tokens;
        else return [];
    }


    async checkHostAlreadyExists(payload: any) {
        let conditions = [];
        let matchCondition;
        if (payload.resetToken && payload.resetToken != '') conditions.push({ resetToken: payload.resetToken })
        if (payload.email && payload.email != '') conditions.push({ email: payload.email });
        if (payload.type && payload.type != '') conditions.push({ type: payload.type })
        if (payload.resetPasswordToken && payload.resetPasswordToken != '') conditions.push({ resetPasswordToken: payload.resetPasswordToken })
        if (payload.emailVerificationToken && payload.emailVerificationToken != '') conditions.push({ emailVerificationToken: payload.emailVerificationToken })
        if (payload.phoneNo && payload.phoneNo != '' && payload.countryCode && payload.countryCode != '') conditions.push(
            { phoneNo: payload.phoneNo, countryCode: payload.countryCode }
        );
        if (payload.userId) conditions.push({ _id: payload.userId })
        if (payload.type && payload.type != '') matchCondition = {
            status: ENUM.USER.STATUS.ACTIVE,
            $and: conditions,
        }
        else matchCondition = {
            status: ENUM.USER.STATUS.ACTIVE,
            $or: conditions,
        }
        if (conditions.length) {
            let userData = await this.basicAggregate(
                [
                    {
                        $match: matchCondition
                    }
                ]
            )
            return userData
        }
        return [];


    }

    async checkSocialIdExists(payload: any) {
        let conditions = [];
        if (payload && payload.email) {
            conditions.push({ email: payload.email });
        } else {
            if (payload.socialType == ENUM.LOGIN_TYPE.FACEBOOK) conditions.push({ facebookId: payload.socialId });
            if (payload.socialType == ENUM.LOGIN_TYPE.LINKEDIN) conditions.push({ linkedInId: payload.socialId });
            if (payload.socialType == ENUM.LOGIN_TYPE.APPLE) conditions.push({ appleId: payload.socialId });
        }
        let userData = await this.basicAggregate(
            [
                {
                    $match: {
                        $or: conditions
                    }
                }
            ]
        )
        return userData;
    }


    async createHostFromSocialId(payload: any, userData?: any) {
        userData && userData.length > 0 ? userData = userData[0] : userData = undefined
        let dataToSave: any = {
            name: payload.name
        };
        if (payload.email && payload.email != '') {
            dataToSave.email = payload.email;
            dataToSave.emailVerified = true;
        };
        if (payload.phoneNo) dataToSave.phoneNo = payload.phoneNo;
        dataToSave.status = userData && userData.status ? userData.status : 'active',
            dataToSave.type = 2,
            dataToSave.accountStatus = userData && userData.accountStatus ? userData.accountStatus : 'unverified',
            dataToSave.profileCompleted = userData && userData.profileCompleted ? userData.profileCompleted : false;
        dataToSave.phoneVerified = userData && userData.phoneVerified ? userData.phoneVerified : false;
        if (payload.countryCode) dataToSave.countryCode = payload.countryCode;
        if (payload.image) dataToSave.image = payload.image;
        if (payload.socialType == ENUM.LOGIN_TYPE.FACEBOOK) dataToSave.facebookId = payload.socialId;
        if (payload.socialType == ENUM.LOGIN_TYPE.LINKEDIN) dataToSave.linkedInId = payload.socialId;
        if (payload.socialType == ENUM.LOGIN_TYPE.APPLE) dataToSave.appleId = payload.socialId;
        if (userData && userData._id) return await this.updateDocument({ _id: userData._id }, dataToSave, { upsert: true, new: true, lean: true })
        else return await new this.model(dataToSave).save();

    }

    async verifyUserPhone(userId: IUser.User['_id']) {
        let update = {
            phoneVerified: true,
            otp: null
        }
        return await this.updateDocument({ _id: userId }, update)
    }


    async mergeUserAccount(payload: any, userData: IUser.User) {
        try {
            let dataToUpdate: any = {}
            if (payload.platform == ENUM.LOGIN_TYPE.FACEBOOK) dataToUpdate = { facebookId: payload.socialId };
            if (payload.platform == ENUM.LOGIN_TYPE.LINKEDIN) dataToUpdate = { linkedInId: payload.socialId };
            return await this.updateDocument({ _id: userData._id }, dataToUpdate);
        } catch (error) {
            console.error(error);
            return Promise.reject(error);
        }

    }

    removeUnnecessaryData(data: any) {
        delete (data.password);
        delete (data.otp);
        delete (data.otpExpiry);
        delete (data.resetToken);
        return data;
    }

    async formatUserResponse(type: string, payload: any) {
        try {
            let dataToSend: any = {}
            switch (type) {
                case DATABASE.FORMATED_RESPONSE_TYPE.VERIFY_OTP: {
                    dataToSend['_id'] = payload._id;
                    dataToSend['status'] = payload.status;
                    dataToSend['type'] = payload.type;
                    dataToSend['accountStatus'] = payload.accountStatus;
                    dataToSend['name'] = payload.name;
                    dataToSend['email'] = payload.email;
                    dataToSend['authToken'] = payload.authToken;
                    dataToSend['createdAt'] = payload.createdAt;
                    dataToSend['countryCode'] = payload.countryCode;
                    dataToSend['phoneNo'] = payload.phoneNo;
                }
                    return dataToSend;
            }
        } catch (error) {
            console.error(error)
            return Promise.reject(error)
        }
    }

    async addPropertySpace(payload: any) {
        try {
            payload['propertyId'] = Types.ObjectId(payload.propertyId);
            payload['category'] = payload.category;
            payload['subCategory'] = payload.subCategory;
            payload['pricing'] = {
                hourly: payload.bookingType == ENUM.USER.BOOKING_TYPE.HOURLY  ?  payload.pricing.hourly : 0,
                daily: payload.bookingType == ENUM.USER.BOOKING_TYPE.CUSTOM  ?  payload.pricing.daily : 0,
                monthly: payload.bookingType == ENUM.USER.BOOKING_TYPE.MONTHLY  ?  payload.pricing.monthly : 0
            }
            payload['propertyName'] = payload.propertyName;
            const spaceData = await PropertySpaceV1.createPropertySpace(payload);
            await this.updateSpaceStartingPrice(spaceData, payload.propertyId);
            return spaceData;
        } catch (error) {
            console.error(`we have an error in addPropertySpace method ==>`, error);
        }
    }

    async updateSpaceStartingPrice(spaceData: Array<any>, propertyId: string): Promise<number | undefined> {
        try {
            if (spaceData) {
                let spaceDetails: any[] = await PropertySpaceV1.findMany({ propertyId: Types.ObjectId(propertyId), status: ENUM.PROPERTY_SPACE.STATUS.ACTIVE }, { pricing: 1 });
                if (spaceDetails.length > 0) {
                    let startingPrice = Number.POSITIVE_INFINITY;
                    let temp;
                    let startingPriceType;
                    let spaceMap: any = {};
                    for (let i = spaceDetails.length - 1; i >= 0; i--) {
                        if (spaceDetails[i].pricing.hourly) {
                            temp = spaceDetails[i].pricing.hourly;
                            startingPriceType = ENUM.PROPERTY.PRICING_TYPE.HOURLY
                        }
                        else {
                            if (spaceDetails[i].pricing.daily) {
                                temp = spaceDetails[i].pricing.daily;
                                startingPriceType = ENUM.PROPERTY.PRICING_TYPE.CUSTOM
                            }
                            else if (spaceDetails[i].pricing.monthly) {
                                temp = spaceDetails[i].pricing.monthly;
                                startingPriceType = ENUM.PROPERTY.PRICING_TYPE.MONTHLY
                            }
                        }
                        if (temp < startingPrice) {
                            startingPrice = temp;
                            startingPriceType = startingPriceType;
                            spaceMap['spaceId'] = spaceDetails[i]._id;
                            spaceMap['isLowest'] = 1;
                        }
                    }
                    let criteria = { _id: Types.ObjectId(propertyId) };
                    let dataToUpdate = { startingPrice: startingPrice, startingPriceType: startingPriceType };
                   await Promise.all([
                        PropertyV1.updateDocument(criteria, dataToUpdate),
                        PropertySpaceV1.updateDocument({ _id: Types.ObjectId(spaceMap?.spaceId) }, { isLowest: 1 }),
                        PropertySpaceV1.updateDocument({ _id: {$ne: Types.ObjectId(spaceMap?.spaceId)} , propertyId : Types.ObjectId(propertyId) }, { isLowest: 0 })
                    ])
                }
            }
            return;
        } catch (error) {
            console.error(`we have an error while updatingSpace starting Price==> ${error}`);
            throw error;
        }
    }
    async partnerEmployeeUnitsCheck(floorDetail: any, res: any, next: NextFunction) {
        try {
            const partnerTotalOccupiedUnits = await PartnerFloorV1.basicAggregate([
                { '$match': { spaceId: Types.ObjectId(floorDetail.floorId), status: ENUM.PROPERTY.STATUS.ACTIVE } },
                { '$project': { employeeUnits: 1, spaceId: 1 } },
                {
                    $group: {
                        _id: '$spaceId',
                        totalEmployeeUnits: { $sum: '$employeeUnits' }
                    }
                }
            ]);
            if (partnerTotalOccupiedUnits?.length && floorDetail?.units.employee < partnerTotalOccupiedUnits[0]?.totalEmployeeUnits) {
                return handleEntityResponse.sendResponse(res, RESPONSE.PROPERTY(res.locals.lang).BAD_EMPLOYEE_REQUEST);
            }
        } catch (error) {
            console.error(`we have an error while fetching partnerEmployeeUnitsCheck ==> ${error}`);
            next(error);
        }
    }

    async updatePropertySpace(payload: any, res: any, next: NextFunction) {
        try {
            if (payload?.pricing?.daily || payload?.pricing?.monthly || payload?.yearly || payload?.pricing?.hourly) {
                payload.pricing = {
                    hourly: payload.bookingType == ENUM.USER.BOOKING_TYPE.HOURLY  ?  payload.pricing.hourly : 0,
                    daily: payload.bookingType == ENUM.USER.BOOKING_TYPE.CUSTOM  ?  payload.pricing.daily : 0,
                    monthly: payload.bookingType == ENUM.USER.BOOKING_TYPE.MONTHLY  ?  payload.pricing.monthly : 0,
                }
            }
            const spaceData: any = await PropertySpaceV1.updateDocument({ _id: Types.ObjectId(payload.floorId) }, payload, { new: true, upsert: true, setDefaultsOnInsert: true });
            if (payload?.pricing?.daily || payload?.pricing?.monthly || payload?.yearly || payload?.pricing?.hourly) {
                this.updateSpaceStartingPrice(spaceData, payload.propertyId);
            }
            await PartnerFloorV1.updateEntity({ spaceId: Types.ObjectId(payload.floorId) }, payload, { multi: true }); //update partner floor data
            return spaceData;
        }
        catch (error) {
            console.error(`we have an error in updatePropertySpace ==>`, error);
            next(error);
        }
    }
    /**
     * @description fetchSpaceDetail by spaceId
     * @param spaceId 
     * @param isOfferPrice 
     */
    async fetchSpaceDetail(spaceId: string) {
        try {
            const { isOfferPrice } = await PropertySpaceV1.findOne({ _id: Types.ObjectId(spaceId) }, { isOfferPrice: 1 });
            switch (isOfferPrice) {
                case ENUM.IS_OFFER_PRICE.TRUE: {
                    let spaceDetail = await PropertySpaceV1.basicAggregate([
                        {
                            "$match": {
                                "status": ENUM.PROPERTY.STATUS.ACTIVE,
                                _id: Types.ObjectId(spaceId),
                                isOfferPrice: ENUM.IS_OFFER_PRICE.TRUE
                            }
                        },
                        {
                            $project: {
                                pricing: 1,
                                capacity: 1,
                                units: 1,
                                subCategory: 1,
                                category: 1,
                                spaceId: 1,
                                propertyId: 1,
                                images: 1,
                                isOfferPrice: 1,
                                include: 1,
                                propertyName: 1
                            }
                        },
                        {
                            "$lookup": {
                                "from": "offers",
                                "let": { "spaceId": "$_id" },
                                "pipeline": [
                                    {
                                        "$match": {
                                            "$expr": {
                                                "$eq": ["$spaceId", "$$spaceId"]
                                            }
                                        }
                                    }
                                ],
                                "as": "offerPrice"
                            }
                        },
                        {
                            '$lookup': {
                                from: 'booking',
                                let: {
                                    propertyId: '$propertyId',
                                    spaceId: '$_id'
                                },
                                pipeline: [
                                    {
                                        '$match': {
                                            '$expr': {
                                                '$and': [
                                                    { '$eq': ['$propertyData.propertyId', '$$propertyId'] },
                                                    { '$eq': ['$spaceId', '$$spaceId'] }
                                                ]
                                            }
                                        }
                                    }
                                ],
                                as: 'bookingArray'
                            }
                        },
                        {
                            $project: {
                                dailyPrice: "$pricing.daily",
                                monthlyPrice: "$pricing.monthly",
                                yearlyPrice: "$pricing.yearly",
                                hourlyPrice: "$pricing.hourly",
                                capacity: 1,
                                units: 1,
                                subCategoryId: "$subCategory._id",
                                categoryId: "$category._id",
                                categoryName: "$category.name",
                                subCategoryName: "$subCategory.name",
                                spaceId: 1,
                                propertyId: 1,
                                propertyName: 1,
                                images: 1,
                                isOfferPrice: 1,
                                offerPrice: 1,
                                include: 1,
                                selectedMaxValue: 1,
                                selectedMinValue: 1,
                                totalBookingCount: {
                                    $size: {
                                        $filter: {
                                            input: "$bookingArray",
                                            as: "booking",
                                            cond: { $ne: ["$$booking.bookingStatus", 5] }
                                        }
                                    }
                                }
                            }
                        }
                    ])
                    return spaceDetail;
                }
                case ENUM.IS_OFFER_PRICE.FALSE: {
                    let spaceDetail = await PropertySpaceV1.basicAggregate([
                        {
                            $match: {
                                status: ENUM.PROPERTY.STATUS.ACTIVE,
                                _id: Types.ObjectId(spaceId),
                                isOfferPrice: ENUM.IS_OFFER_PRICE.FALSE
                            }
                        },
                        {
                            '$lookup': {
                                from: 'booking',
                                let: {
                                    propertyId: '$propertyId',
                                    spaceId: '$_id'
                                },
                                pipeline: [
                                    {
                                        '$match': {
                                            '$expr': {
                                                '$and': [
                                                    { '$eq': ['$propertyData.propertyId', '$$propertyId'] },
                                                    { '$eq': ['$spaceId', '$$spaceId'] }
                                                ]
                                            }
                                        }
                                    }
                                ],
                                as: 'bookingArray'
                            }
                        },
                        {
                            $project: {
                                dailyPrice: "$pricing.daily",
                                monthlyPrice: "$pricing.monthly",
                                yearlyPrice: "$pricing.yearly",
                                hourlyPrice: "$pricing.hourly",
                                capacity: 1,
                                units: 1,
                                subCategoryId: "$subCategory._id",
                                categoryId: "$category._id",
                                categoryName: "$category.name",
                                subCategoryName: "$subCategory.name",
                                spaceId: 1,
                                propertyId: 1,
                                images: 1,
                                isOfferPrice: 1,
                                offerPrice: { $literal: [] },
                                include: 1,
                                propertyName: 1,
                                totalBookingCount: {
                                    $size: {
                                        $filter: {
                                            input: "$bookingArray",
                                            as: "booking",
                                            cond: { $ne: ["$$booking.bookingStatus", 5] }
                                        }
                                    }
                                }
                            }
                        }
                    ])
                    return spaceDetail;
                }
                default:
                    break;
            }
        } catch (error) {
            console.error(`we have an error in host entity ==> ${error}`);
            return Promise.reject(error);
        }
    }
    async fectchHostProfileDetails(userId: string) {
        try {
            let pipeline = [];
            pipeline.push({
                $match: {
                    _id: Types.ObjectId(userId)
                }
            },
                {
                    "$lookup": {
                        "from": "user_company_details",
                        "let": { "userId": "$_id" },
                        "pipeline": [
                            {
                                "$match": {
                                    "$expr": {
                                        "$eq": ["$userId", "$$userId"]
                                    }
                                }
                            },

                        ],
                        "as": "userComapnyDetails"
                    }
                },
                {
                    "$unwind": {
                        "path": "$userComapnyDetails",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $project: {
                        "_id": 1,
                        "status": 1,
                        "type": 1,
                        "emailVerified": 1,
                        "accountStatus": 1,
                        "profileCompleted": 1,
                        "name": 1,
                        "email": 1,
                        "address": 1,
                        "zipCode": 1,
                        "landmark": 1,
                        "street": 1,
                        "countryCode": 1,
                        "phoneNo": 1,
                        "createdAt": 1,
                        "updatedAt": 1,
                        "bio": 1,
                        "dob": 1,
                        "image": 1,
                        "userComapnyDetails": 1,
                        notificationEnabled: 1,
                        mailNotificationEnabled: 1,
                        twitterUrl: 1,
                        fbUrl: 1,
                        linkedinUrl: 1,
                        instaUrl: 1,
                        slackUrl: 1,
                        youtubeUrl: 1,
                        permissions: 1,
                        isCohost: 1,
                        facebookId: 1,
                        linkedInId: 1,
                        appleId: 1,
                        commissionAmount: 1
                    }
                })
            let result = await hostModel.aggregate(pipeline);
            if (result && result.length > 0) return result[0]
            else return {}

        } catch (error) {
            console.error(`we have an error in user ==> ${error}`);
            return Promise.reject(error);
        }
    }


    async createCohost(payload: any): Promise<IUser.User> {
        payload.isCohost = 1
        payload.hostId = payload.userId
        let password = await this.randomPassword(8)
        payload.password = Auth.hashData(password, CONSTANT.PASSWORD_HASH_SALT)
        let hostData: any = await new this.model(payload).save();
        await HostV1.updateOne({ _id: Types.ObjectId(payload.userId) }, { $push: { coHost: Types.ObjectId(hostData._id) } })
        hostData = {
            _id: hostData._id,
            permissions: hostData.permissions,
            name: hostData.name,
            countryCode: hostData.countryCode,
            phoneNo: hostData.phoneNo,
            password: password,
            email: hostData.email
        }
        return hostData;
    }


    async randomPassword(len: any) {
        var length = (len) ? (len) : (10);
        var entity1, entity2, entity3, hold
        var string = "abcdefghijklmnopqrstuvwxyz"; //to upper 
        var numeric = '0123456789';
        var punctuation = '!@';
        var password = "";
        var character = "";
        // var crunch = true;
        while (password.length < length) {
            entity1 = Math.ceil(string.length * Math.random() * Math.random());
            entity2 = Math.ceil(numeric.length * Math.random() * Math.random());
            entity3 = Math.ceil(punctuation.length * Math.random() * Math.random());
            hold = string.charAt(entity1);
            hold = (password.length % 2 == 0) ? (hold.toUpperCase()) : (hold);
            character += hold;
            character += numeric.charAt(entity2);
            character += punctuation.charAt(entity3);
            password = character;
        }
        password = password.split('').sort(function () { return 0.5 - Math.random() }).join('');
        return password.substr(0, len);
    }

    async initiateRefund(bookingId: string, bookingDetail: any): Promise<any> {
        try {
            const differenceTime = Math.abs(bookingDetail?.toDate - bookingDetail?.fromDate); // return absolute difference
            const numberOfDays = Math.ceil(differenceTime / (1000 * 60 * 60 * 24)); // conversion into milliseconds and return ceil dayNumber
            let criteria = await BookingV1.cancellationCriteria(bookingDetail, numberOfDays);
            let amountToRefund;
            if (criteria) {
                criteria?.PERCENT_AMOUNT > 0 ? amountToRefund = criteria?.PERCENT_AMOUNT : {};
            }
            await PaymentController.refund(bookingId, amountToRefund)
        } catch (error) {
            console.error(`we have an error in initiateRefund ==> ${error}`);
        }
    }
}

export const HostV1 = new HostEntity(hostModel);