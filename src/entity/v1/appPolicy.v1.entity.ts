/**
 * @file admin.v1.entity
 * @description defines v1 admin entity methods
 * @author Desk Now Dev Team
*/

import { Model } from "mongoose";

import BaseEntity from "../base.entity";
import appConfigModel, { IAppConfig } from "@models/appPolicy.model";


class AppConfigEntity extends BaseEntity {

    constructor(model: Model<any>) {
        super(model);
    }

    async create(payload: any): Promise<IAppConfig> {
        let tAndC = await new this.model(payload).save();
        return tAndC.toObject();
    }

    async listAllAppConfig(params:any): Promise<IAppConfig> {
        let pipeline: Array<object> = [];
        let matchCriteria: any = { $match: { $and: [] } };
        matchCriteria.$match.$and.push({status:'active'});
        matchCriteria.$match.$and.push({lang:params.lang});
        pipeline.push(matchCriteria);
        let details: any = await AppPolicyV1.paginateAggregate(pipeline, { limit: params && params.limit ? params.limit = parseInt(params.limit) : params.limit = 2, page: params.page, getCount: true });
        return details;
    }

}

export const AppPolicyV1 = new AppConfigEntity(appConfigModel);