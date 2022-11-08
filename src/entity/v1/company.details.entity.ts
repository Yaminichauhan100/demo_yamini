/**
 * @file host.v1.entity
 * @description defines v1 host entity methods
 * @created 2020-04-02 11:27:06
 * @author Desk Now Dev Team
*/

import { Model, Types } from "mongoose";
import BaseEntity from "../base.entity";
import CompanyModel from "@models/user.company_details.model";
import { HostV1 } from "./host.v1.entity";
import { UserV1 } from "./user.v1.entity";

class CompanyDetailEntity extends BaseEntity {

    constructor(model: Model<any>) {
        super(model);
    }



    /**
     * creates a new user
     * @param payload - user data to insert
     */
    async hostCompanyDetails(payload: any): Promise<IHost.Host> {
        let promise = []
        promise.push(new this.model(payload).save())
        promise.push(HostV1.updateDocument({ _id: payload.userId }, { profileCompleted: true }))
        let promiseData = await Promise.all(promise)
        return promiseData[0].toObject();
    }

    /**
    * creates a new user
    * @param payload - user data to insert
    */
    async userCompanyDetails(payload: any): Promise<IHost.Host> {
        let promise = []
        promise.push(new this.model(payload).save())
        promise.push(UserV1.updateDocument({ _id: payload.userId }, { profileCompleted: true }))
        let promiseData = await Promise.all(promise)
        return promiseData[0].toObject();
    }


    /**
     * filters user data for safe response
     * @params userData
     */
    filterCompanyData(userData: IHost.Host): IHost.Host {
        return userData;
    }




    async updateProperty(payload: any, id: any) {
        this.updateDocument({ '_id': Types.ObjectId(id) }, payload)
    }

    async verifyUserPhone(userId: IUser.User['_id']) {
        let update = {
            phoneVerified: true,
            otp: null
        }
        return await this.updateDocument({ _id: userId }, update)
    }




    removeUnnecessaryData(data: any) {
        delete (data.password);
        delete (data.otp);
        delete (data.otpExpiry);
        delete (data.resetToken);
        return data;
    }

}

export const CompanyV1 = new CompanyDetailEntity(CompanyModel);