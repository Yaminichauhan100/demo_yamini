/**
 * @file admin.v1.entity
 * @description defines v1 admin entity methods
 * @author Desk Now Dev Team
*/

import { Model } from "mongoose";

import BaseEntity from "../base.entity";
import advModel from "@models/admin.advprice.model";


class AdvEntity extends BaseEntity {

    constructor(model: Model<any>) {
        super(model);
    }

    async create(payload: any): Promise<IFaq.FaqModel> {
        let advData = await new this.model(payload).save();
        return advData.toObject();
    }

}

export const AdvV1 = new AdvEntity(advModel);