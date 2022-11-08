/**
 * @file admin.v1.entity
 * @description defines v1 admin entity methods
 * @author Desk Now Dev Team
*/

import { Model } from "mongoose";

import BaseEntity from "../base.entity";
import faqModel from "@models/admin_faq.model";


class FaqEntity extends BaseEntity {

    constructor(model: Model<any>) {
        super(model);
    }

    async create(payload: any): Promise<IFaq.FaqModel> {
        let faqData = await new this.model(payload).save();
        return faqData.toObject();
    }

}

export const FaqV1 = new FaqEntity(faqModel);