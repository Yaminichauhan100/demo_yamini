/**
 * @file admin.v1.entity
 * @description defines v1 admin entity methods
 * @author Desk Now Dev Team
*/

import { Model } from "mongoose";

import BaseEntity from "../base.entity";
import UnclaimedModel from "@models/unclaimed.properties.model";

class UnclaimedEntity extends BaseEntity {

    constructor(model: Model<any>) {
        super(model);
    }

    async saveProperty(payload: any) {
       return await new this.model(payload).save();
    }

}

export const UnclaimV1 = new UnclaimedEntity(UnclaimedModel);