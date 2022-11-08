
/**
 * @file employee.v1.entity
 * @description defines v1 partner entity methods
 * @author Desk Now Dev Team
*/

import { Model } from "mongoose";

import BaseEntity from "../base.entity";
import FloorModel from "@models/host.partner.floor.model";

class FloorEntity extends BaseEntity {

    constructor(model: Model<any>) {
        super(model);
    }

    async create(payload: any) {
        let faqData = await new this.model(payload).save();
        return faqData.toObject();
    }

}

export const PartnerFloorV1 = new FloorEntity(FloorModel);