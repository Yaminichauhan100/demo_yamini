/**
 * @file admin.v1.entity
 * @description defines v1 admin entity methods
 * @author Desk Now Dev Team
*/

import { Model, Types } from "mongoose";

import BaseEntity from "../base.entity";
import PayoutModel from "@models/payout.model";

class PayoutEntity extends BaseEntity {

    constructor(model: Model<any>) {
        super(model);
    }

    async insertPayoutData(data: any) {
        try {
            await PayoutV1.findOne({ hostId: Types.ObjectId(data.hostId) },
                { adminCommissionAmount: 1, hostAmount: 1 });
        } catch (error) {
            console.error(`we have an error => ${error}`);
            throw error;
        }
    }

}

export const PayoutV1 = new PayoutEntity(PayoutModel);