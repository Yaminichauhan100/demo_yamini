/**
 * @file admin.v1.entity
 * @description defines v1 admin entity methods
 * @author Desk Now Dev Team
*/

import { Model } from "mongoose";

import BaseEntity from "../base.entity";
import SubjectModel from "@models/subject.model";

class StatesEntity extends BaseEntity {

    constructor(model: Model<any>) {
        super(model);
    }

    async create(payload: any) {
        let data = await new this.model(payload).save();
        return data.toObject();
    }

}

export const SubjectV1 = new StatesEntity(SubjectModel);