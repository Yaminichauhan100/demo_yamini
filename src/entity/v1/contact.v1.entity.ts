/**
 * @file admin.v1.entity
 * @description defines v1 admin entity methods
 * @author Desk Now Dev Team
*/

import { Model } from "mongoose";

import BaseEntity from "../base.entity";
import contactModel from "@models/contact.model";


class ContactEntity extends BaseEntity {

    constructor(model: Model<any>) {
        super(model);
    }

    async create(payload: any) {
        let tAndC = await new this.model(payload).save();
        return tAndC.toObject();
    }



}

export const ContactV1 = new ContactEntity(contactModel);