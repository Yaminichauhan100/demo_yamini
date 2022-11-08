/**
 * @file admin.v1.entity
 * @description defines v1 admin entity methods
 * @author Desk Now Dev Team
*/

import { Model } from "mongoose";

import BaseEntity from "../base.entity";
import OtpModel from "@models/otp.model";
import { redisDOA } from "@services";
import { DATABASE } from "@common";

class OtpEntity extends BaseEntity {

    constructor(model: Model<any>) {
        super(model);
    }

    async saveOtp(payload: any) {
        try {
            return await Promise.all([
                OtpModel.findOneAndUpdate({ countryCode: payload.countryCode, phoneNo: payload.phoneNo }, payload, { upsert: true }),
                redisDOA.insertKeyInRedis(`${payload.countryCode}-${payload.phoneNo}-${payload.type}`, payload.otp),
                redisDOA.expireKey(`${payload.countryCode}-${payload.phoneNo}-${payload.type}`, DATABASE.REDIS.OTP_EXPIRED_TIME)
            ])
        } catch (error) {
            return Promise.reject(error)
        }
    };

    async saveOtpFinalCount(payload: any) {
        try {
            return await Promise.all([
                OtpModel.findOneAndUpdate({ countryCode: payload.countryCode, phoneNo: payload.phoneNo }, payload, { upsert: true }),
                redisDOA.insertKeyInRedis(`${payload.countryCode}-${payload.phoneNo}-${payload.type}`, payload.otp),
                redisDOA.expireKey(`${payload.countryCode}-${payload.phoneNo}-${payload.type}`, 300)
            ])
        } catch (error) {
            return Promise.reject(error)
        }
    };
    
    async getUserOtpFromDb(payload: any) {
        try {
            let getOtpFromRedis = await redisDOA.getFromKey(`${payload.countryCode}-${payload.phoneNo}-${payload.type}`)
            return getOtpFromRedis
        } catch (error) {
            let getOtpFromMongo = await OtpModel.findOne({ countryCode: payload.countryCode, phoneNo: payload.phoneNo, type: payload.type }, { otp: 1 })
            if (getOtpFromMongo && getOtpFromMongo.otp) return getOtpFromMongo.otp
            else return Promise.reject(error)
        }
    }

}

export const OtpV1 = new OtpEntity(OtpModel);