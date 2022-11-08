/**
 * @file user.v1.entity
 * @description defines v1 user entity methods
 * @created 2019-08-25 23:24:06
 * @author Desk Now Dev Team
*/

import { Model, Types } from "mongoose";
import { ENUM, ENUM_ARRAY } from "@common";
import BaseEntity from "../base.entity";
import UserModel from "@models/user.model";
import UserSessionModel from "@models/user_sessions.model";
import { Auth } from "../../services/auth.service"
import { CONSTANT, DATABASE } from "../../common/constant.common"
import { redisDOA, PushNotification } from "@services"
import user_sessionsModel from "@models/user_sessions.model";
import { BookingV1, HostV1, RecentSearchV1, PropertySpaceV1, EmployeeV1, PartnerFloorV1 } from "@entity";

class UserEntity extends BaseEntity {

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
        await redisDOA.setKey("users", JSON.stringify(dataToInsertInRedis))
        return userData.toObject();
    }

    /**
     * creates a new user
     * @param payload - user data to insert
     */
    async createUserNew(payload: IUser.Request.CreateUser): Promise<IUser.User> {
        let adminData = await new this.model(payload).save();
        return adminData.toObject();
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
        payload['userId'] = Types.ObjectId(payload.userId);
        let sessionData: any = await new UserSessionModel(payload).save();
        return sessionData.toObject();
    }

    /**
     * removes all previous session of user
     * @params payload - user session data payload
     */
    async removePreviousSession(id: Types.ObjectId, multi: Boolean): Promise<void> {
        if (multi) await UserSessionModel.updateMany({ userId: id, isActive: true }, { isActive: false });
        else await UserSessionModel.updateOne({ _id: id }, { isActive: false });
    }

    /**
     * removes all previous session of user
     * @params payload - user session data payload
     */
    async removeSession(id: Types.ObjectId): Promise<void> {
        await UserSessionModel.updateMany({ _id: id }, { isActive: false });
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


    async checkUserAlreadyExists(payload: any) {
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
                        status: ENUM.USER.STATUS.ACTIVE,
                        $or: conditions
                    }
                }
            ]
        )
        return userData
    }


    async createUserFromSocialId(payload: any, userData?: any) {
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
            dataToSave.type = 1,
            dataToSave.accountStatus = userData && userData.accountStatus ? userData.accountStatus : 'unverified',
            dataToSave.profileCompleted = userData && userData.profileCompleted ? userData.profileCompleted : false;
        dataToSave.phoneVerified = userData && userData.phoneVerified ? userData.phoneVerified : false;
        if (payload.countryCode) dataToSave.countryCode = payload.countryCode;
        if (payload.image) dataToSave.image = payload.image;
        if (payload.socialType == ENUM.LOGIN_TYPE.FACEBOOK) dataToSave.facebookId = payload.socialId;
        if (payload.socialType == ENUM.LOGIN_TYPE.LINKEDIN) dataToSave.linkedInId = payload.socialId;
        if (payload.socialType == ENUM.LOGIN_TYPE.APPLE) dataToSave.appleId = payload.socialId;
        if (userData && userData._id) return await this.updateDocument({ _id: userData._id }, dataToSave, { upsert: true, new: true, lean: true })
        else {
            let checkUserExistsAsPartner: any = await EmployeeV1.findMany({ status: ENUM.USER.STATUS.ACTIVE, partnerStatus: ENUM.USER.STATUS.ACTIVE, $or: [{ email: payload.email }, { phoneNo: payload.phoneNo, countryCode: payload.countryCode }] }, { partnerId: 1, _id: 0 })
            if (checkUserExistsAsPartner.length > 0) {
                for (let i = 0; i < checkUserExistsAsPartner.length; i++) {
                    let findPartnerHaveActiveFloors = await PartnerFloorV1.findOne({ partnerId: Types.ObjectId(checkUserExistsAsPartner[i].partnerId), status: ENUM.PROPERTY.STATUS.ACTIVE })
                    if (findPartnerHaveActiveFloors) {
                        dataToSave.partnerId = []
                        for (let i = 0; i < checkUserExistsAsPartner.length; i++) dataToSave.partnerId.push(Types.ObjectId(checkUserExistsAsPartner[i].partnerId))
                    }
                }
            }
            let response: any = await new this.model(dataToSave).save();
            let checkUserExistsAsPartnerButInactive: any = await EmployeeV1.findMany({ $or: [{ email: payload.email }, { phoneNo: payload.phoneNo, countryCode: payload.countryCode }] }, { partnerId: 1, _id: 0 })
            if (checkUserExistsAsPartnerButInactive.length > 0) {
                await EmployeeV1.updateEntity({ $or: [{ email: payload.email }, { phoneNo: payload.phoneNo, countryCode: payload.countryCode }] }, { userId: Types.ObjectId(response._id) }, { multi: true })
            }

            return response
        }
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
            console.error("Error", error);
            return Promise.reject(error)
        }
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
                    dataToSend['image'] = payload.image;
                    dataToSend['createdAt'] = payload.createdAt;
                    dataToSend['countryCode'] = payload.countryCode;
                    dataToSend['phoneNo'] = payload.phoneNo;
                }
                    return dataToSend
            }
        } catch (error) {
            console.error("Error", error);
            return Promise.reject(error)
        }
    }
    removeUnnecessaryData(data: any) {
        delete (data.password);
        delete (data.otp);
        delete (data.otpExpiry);
        delete (data.resetToken);
        return data;
    }

    /**
     * @description to return recent search items
     * @param payload 
     */
    async fetchSearchList(payload: { userId: string; }) {
        try {
            const { userId } = payload;
            let response = await RecentSearchV1.findMany({ userId: Types.ObjectId(userId) }, {}, { createdAt: -1 });
            return response;
        } catch (error) {
            console.error(`we have an error in user ==> ${error}`);
            return Promise.reject(error);
        }
    }
    /**
     * @method get
     * @author Atul
     * @description method to return category,subCategory,includes and dynamicPrice if available for user property detail table 
     * @param payload { propertyId, startDate, endDate }
     */
    async fetchOfferPricingForUser(payload: any, spaceId?: string) {
        try {
            const { propertyId, fromDate, toDate } = payload;
            let pipeline: any = [];
            let matchCondition: any = {};
            matchCondition['propertyId'] = Types.ObjectId(propertyId);
            matchCondition['status'] = ENUM.PROPERTY.STATUS.ACTIVE;

            spaceId ? matchCondition['_id'] = Types.ObjectId(spaceId) : "";

            let pipelineMatchCondition: any = {
                "$expr": {
                    "$and": [
                        { "$eq": ["$spaceId", "$$spaceId"] },
                    ]
                }
            };
            if (fromDate && toDate) {
                pipelineMatchCondition['$expr']['$and'] =
                    [
                        { "$eq": ["$spaceId", "$$spaceId"] },
                        { '$gte': [DATABASE.DATE_CONSTANTS.fromDate(fromDate, payload?.offset), '$startDate'] },
                        { '$lte': [DATABASE.DATE_CONSTANTS.fromDate(fromDate, payload?.offset), '$endDate'] }
                    ]
            }
            pipeline.push(
                { '$match': matchCondition },
                {
                    "$lookup": {
                        "from": "offers",
                        "let": {
                            "spaceId": "$_id"
                        },
                        "pipeline": [
                            {
                                "$match": pipelineMatchCondition
                            },
                            {
                                $project: {
                                    priceDetails: {
                                        $filter: {
                                            input: "$priceDetails",
                                            as: "elem",
                                            cond: { $ne: ["$$elem.discountPercentage", 0] }
                                        }
                                    }
                                }
                            }
                        ],
                        "as": "offerPricing"
                    }
                },
                {
                    $group: {
                        _id: '$category._id',
                        data: {
                            $addToSet: {
                                offerPricing: "$offerPricing",
                                defaultPrice: "$pricing",
                                price: '$priceDetails',
                                startDate: '$startDate',
                                endDate: '$endDate',
                                isOfferPrice: "$isOfferPrice",
                                seasonName: '$seasonName',
                                spaceId: '$spaceId',
                                category: '$category',
                                subCategory: '$subCategory',
                                include: '$include',
                                capacity: '$capacity',
                                units: '$units',
                                space_Id: '$_id',
                                maxQuantity: '$units',
                                isLowest: '$isLowest',
                                floorNumber: '$floorNumber',
                                floorDescription: '$floorDescription'
                            }
                        }
                    }
                }
            )
            let response = await PropertySpaceV1.basicAggregate(pipeline);
            return response;
        } catch (error) {
            console.error(`we have an error in fetching in user entity ==> ${error}`);
            return Promise.reject(error);
        }
    }
    /**
    * @description  get user profile details
    * @param payload 
    */
    async fectchUserProfileDetails(userId: string) {
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
                                    $and: [
                                        { $expr: { $eq: ["$userId", "$$userId"] } },
                                        { $expr: { $eq: ["$status", ENUM.USER.STATUS.ACTIVE] } }
                                    ]
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
                        address: { $cond: [{ $not: ["$address"] }, { $literal: "" }, "$address"] },
                        bio: { $cond: [{ $not: ["$bio"] }, { $literal: "" }, "$bio"] },
                        "zipCode": 1,
                        "landmark": 1,
                        "street": 1,
                        "countryCode": 1,
                        "phoneNo": 1,
                        "createdAt": 1,
                        "updatedAt": 1,
                        "dob": { $cond: [{ $not: ["$dob"] }, { $literal: "" }, "$dob"] },
                        "image": 1,
                        "userComapnyDetails": 1,
                        "companyType": 1,
                        "subCompanyType": 1,
                        notificationEnabled: 1,
                        mailNotificationEnabled: 1,
                        profileStatus: 1,
                        passbaseVerification: 1,
                        facebookId: 1,
                        linkedInId: 1,
                        appleId: 1,
                        googleCalendarSyncStatus: 1,
                        outlookCalendarSyncStatus: 1
                    }
                })
            let result = await UserModel.aggregate(pipeline);
            if (result && result.length > 0) {
                return result[0];
            }
            else return {};
        } catch (error) {
            console.error(`we have an error in user ==> ${error}`);
            return Promise.reject(error);
        }
    }


    async fetchUserDeviceToken(userId: string): Promise<any> {
        try {
            return await UserSessionModel.distinct("device.token", {
                userId: Types.ObjectId(userId),
                isActive: true,
                notificationEnabled: ENUM_ARRAY.NOTIFICATION.ENABLE
            })
        } catch (error) {
            console.error(`we have an error ==> ${error}`);
        }
    }

    async otpExhaustLimit(payload: any, keyName?: string) {
        try {
            keyName ? keyName = keyName : keyName = `${payload.countryCode}_${payload.phoneNo}_${payload.type}`;
            let keyExist = await redisDOA.getFromKey(keyName);
            if (!keyExist) await redisDOA.insertKeyInRedis(keyName, '5');
            let ttl = await redisDOA.getTTL(keyName);
            // this states that if key exist and attempt is last and has no ttl that 5 min timer will begin. After this user will again get new  5 attempts.
            // we can start the timer al his last attempt or on his last hit. Which means on his every new hit timer will reset to 5 min.
            if (keyExist ) await redisDOA.expireKey(keyName,300);
            //&& keyExist === '0' && ttl == -1
            let attemptCountLeft = await redisDOA.decrementKeyInRedis(keyName);
            if(attemptCountLeft && attemptCountLeft < 0) attemptCountLeft = 0
            let response: any = {
                timeToRetryInSeconds: attemptCountLeft < 1 ? ttl : 0,
                attemptCountLeft: attemptCountLeft || attemptCountLeft >= 0 ? Number(attemptCountLeft)  : ""
            }
            return await response;
        } catch (error) {
            console.error(`we have an error in ${error}`);
        }
    }
    async otpExhaustLimitforgotPassword(payload: any) {
        try {
            let keyName = `otpForgot_${payload.phoneNo}_${payload.type}`;
            return await this.otpExhaustLimit(payload, keyName);
        } catch (error) {
            console.error(`we have an error in ${error}`);
        }
    }
    async otpExhaustLimitVerifyNewPhoneNo(payload: any) {
        try {
            let keyName = `otpNewPhone_${payload.phoneNo}_${payload.type}`;
            return await this.otpExhaustLimit(payload, keyName);
        } catch (error) {
            console.error(`we have an error in otp handling ==> ${error}`);
        }
    }
    async otpExhaustBlockHandling(payload: any, keyName?: string) {
        try {
            keyName ? keyName = keyName : keyName = `${payload.countryCode}-${payload.phoneNo}-${payload.type}`;
            console.log("keyName----->",keyName)
            const keyExist = await redisDOA.getKeyFromRedis(keyName);
            console.log("keyExist---->", keyExist)
            if (keyExist) {
                let timeLeft = await redisDOA.getTTL(keyName);
                let minutesLeft = Math.floor(timeLeft / 60);
                let secondsLeft = timeLeft - minutesLeft * 60;
                return { minutesLeft, secondsLeft };
            }
            else return `don't block`;
        } catch (error) {
            console.error(`we have an error ==> ${error}`);
            throw error;
        }
    }
    async otpExhaustBlockerOtpNewPhone(payload: any) {
        try {
            let keyName = `${payload.countryCode}-${payload.phoneNo}_-${payload.type}`;
            return await this.otpExhaustBlockHandling(payload, keyName);
        } catch (error) {
            console.error(`we have an error ==> ${error}`);
            throw error;
        }
    }


    async updateUserToken(hostId: string, deviceToken: string): Promise<any> {
        try {
            return await user_sessionsModel.updateMany({ userId: Types.ObjectId(hostId), isActive: true },
                {
                    $set: { 'device.token': deviceToken }
                },
                { multi: true })
        } catch (error) {
            console.error(`we have an error in updatingDeviceToken ==> ${error}`);
        }
    }

    async updateProfileBadges(profileDetail: any): Promise<any> {
        try {
            if (profileDetail.subCompanyType == ENUM.USER.SUB_COMPANY_TYPE.COMPANY) {
                if (profileDetail.passbaseVerification == 1) {
                    if (!profileDetail.userComapnyDetails.houseNo ||
                        !profileDetail.userComapnyDetails.city ||
                        !profileDetail.userComapnyDetails.country ||
                        !profileDetail.userComapnyDetails.countryCode ||
                        !profileDetail.userComapnyDetails.documents ||
                        !profileDetail.userComapnyDetails.name ||
                        !profileDetail.userComapnyDetails.phoneNo ||
                        !profileDetail.userComapnyDetails.regNo ||
                        !profileDetail.userComapnyDetails.state ||
                        !profileDetail.userComapnyDetails.zipCode ||
                        !profileDetail.dob ||
                        !profileDetail.bio ||
                        !profileDetail.image ||
                        !profileDetail.address
                    ) {
                        await UserV1.updateDocument(
                            { _id: Types.ObjectId(profileDetail._id) },
                            { profileStatus: ENUM.USER.PROFILE_STATUS.INTERMEDIATE })
                    }
                    else {
                        await UserV1.updateDocument(
                            { _id: Types.ObjectId(profileDetail._id) },
                            { profileStatus: ENUM.USER.PROFILE_STATUS.ADVANCED })
                    }
                }
                else {
                    if (!profileDetail.userComapnyDetails.houseNo ||
                        !profileDetail.userComapnyDetails.city ||
                        !profileDetail.userComapnyDetails.country ||
                        !profileDetail.userComapnyDetails.countryCode ||
                        !profileDetail.userComapnyDetails.documents ||
                        !profileDetail.userComapnyDetails.name ||
                        !profileDetail.userComapnyDetails.phoneNo ||
                        !profileDetail.userComapnyDetails.regNo ||
                        !profileDetail.userComapnyDetails.state ||
                        !profileDetail.userComapnyDetails.zipCode ||
                        !profileDetail.dob ||
                        !profileDetail.bio ||
                        !profileDetail.image ||
                        !profileDetail.address
                    ) {
                        await UserV1.updateDocument(
                            { _id: Types.ObjectId(profileDetail._id) },
                            { profileStatus: ENUM.USER.PROFILE_STATUS.BEGINNER })
                    }
                    else {
                        await UserV1.updateDocument(
                            { _id: Types.ObjectId(profileDetail._id) },
                            { profileStatus: ENUM.USER.PROFILE_STATUS.INTERMEDIATE })
                    }
                }
            }
            if (profileDetail.subCompanyType == ENUM.USER.SUB_COMPANY_TYPE.FREELANCER) {
                if (profileDetail.passbaseVerification == 1) {
                    if (!profileDetail.dob || !profileDetail.bio || !profileDetail.image || !profileDetail.address) {
                        await UserV1.updateDocument(
                            { _id: Types.ObjectId(profileDetail._id) },
                            { profileStatus: ENUM.USER.PROFILE_STATUS.INTERMEDIATE })
                    }
                    else {
                        await UserV1.updateDocument(
                            { _id: Types.ObjectId(profileDetail._id) },
                            { profileStatus: ENUM.USER.PROFILE_STATUS.ADVANCED })
                    }
                }
                else {
                    if (!profileDetail.dob || !profileDetail.bio || !profileDetail.image || !profileDetail.address) {
                        await UserV1.updateDocument(
                            { _id: Types.ObjectId(profileDetail._id) },
                            { profileStatus: ENUM.USER.PROFILE_STATUS.BEGINNER })
                    }
                    else {
                        await UserV1.updateDocument(
                            { _id: Types.ObjectId(profileDetail._id) },
                            { profileStatus: ENUM.USER.PROFILE_STATUS.INTERMEDIATE })
                    }
                }
            }
        } catch (error) {
            console.error(`we have an error in updatingBadge ==> ${error}`);
        }
    }
    async updateUserIndividualBadge(finalResponse: any, payload: any) {
        try {
            if (finalResponse.companyType != 'company') {
                if (finalResponse.passbaseVerification == 1) {
                    if (!finalResponse.dob || !finalResponse.bio || !finalResponse.image || !finalResponse.address) {
                        await UserV1.updateDocument(
                            { _id: Types.ObjectId(payload.userId) },
                            { profileStatus: ENUM.USER.PROFILE_STATUS.INTERMEDIATE })
                    }
                    else {
                        await UserV1.updateDocument(
                            { _id: Types.ObjectId(payload.userId) },
                            { profileStatus: ENUM.USER.PROFILE_STATUS.ADVANCED })
                    }
                }
                else {
                    if (!finalResponse.dob || !finalResponse.bio || !finalResponse.image || !finalResponse.address) {
                        await UserV1.updateDocument(
                            { _id: Types.ObjectId(payload.userId) },
                            { profileStatus: ENUM.USER.PROFILE_STATUS.BEGINNER })
                    }
                    else {
                        await UserV1.updateDocument(
                            { _id: Types.ObjectId(payload.userId) },
                            { profileStatus: ENUM.USER.PROFILE_STATUS.INTERMEDIATE })
                    }
                }
            }
        } catch (error) {
            console.error(`we have an error while updating individual badge ${error}`);
        }
    }

    async sendAutoRejectPush(bookingId: string): Promise<any> {
        try {
            const bookingDetail: any = await BookingV1.findOne({ _id: Types.ObjectId(bookingId) });
            let [hostToken, userToken] = await Promise.all(
                [
                    HostV1.fetchHostDeviceToken(bookingDetail?.hostId),
                    UserV1.fetchUserDeviceToken(bookingDetail.userData.userId)
                ])
            await Promise.all(
                [
                    PushNotification.bookingRequestHostReject(hostToken, bookingDetail),
                    PushNotification.sendBookingRequestUserRejected(userToken, bookingDetail)
                ])
        } catch (error) {
            console.error(`we have an error in sending auto reject error ==> ${error}`);
        }
    }

    async getUserCount(payload: any) {
        try {
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
            let result: any = await UserModel.aggregate(pipeline);
            result && result.length > 0 ? result = result[0] : result = { count: 0 }
            return result?.count;
        } catch (error) {
            console.error(`we have an error in user ==> ${error}`);
            return Promise.reject(error);
        }
    }
}

export const UserV1 = new UserEntity(UserModel);