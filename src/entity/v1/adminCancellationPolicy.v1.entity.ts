/**
 * @file admin.v1.entity
 * @description defines v1 admin entity methods
 * @author Desk Now Dev Team
*/

import { Model, Types } from "mongoose";
import BaseEntity from "../base.entity";
import CancellationModel from "@models/cancellation.policy.model";

class CancellationPolicyEntity extends BaseEntity {
    constructor(model: Model<any>) {
        super(model);
    }

    async create(payload: any) {
        try {
            let cancellationPolicy = await new this.model(payload).save();
            return cancellationPolicy;
        } catch (error) {
            console.error(`we have an error ==> ${error}`);
        }
    }

    async getCancellationPolicy(payload: any): Promise<any> {
        try {
            return await CancellationPolicyV1.findOne({ _id: Types.ObjectId(payload.id), lang: payload.lang });
        } catch (error) {
            console.error(`we have an error ==> ${error}`);
        }
    }

    async getAllCancellationPolicy(payload: any): Promise<any> {
        try {
            let cancellationList = await CancellationPolicyV1.findMany({ lang: 'EN', userType: 1 });
            return cancellationList;
        } catch (error) {
            console.error(`we have an error ==> ${error}`);
        }
    }

    async getAllCancellationPolicyForHost(payload: any): Promise<any> {
        try {
            let matchCondition: any;
            if (payload?.lang) matchCondition = { lang: payload.lang, userType: payload.userType }
            let arrayData = await CancellationPolicyV1.findMany(matchCondition);
            return arrayData;
        } catch (error) {
            console.error(`we have an error ==> ${error}`);
        }
    }

}
export const CancellationPolicyV1 = new CancellationPolicyEntity(CancellationModel);