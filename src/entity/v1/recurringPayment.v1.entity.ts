/**
 * @file recurring payment.v1.entity
 * @description defines v1 recurring payment entity methods
 * @author Desk Now Dev Team
*/

import { Model } from "mongoose";
import BaseEntity from "../base.entity";
import recurringPaymentModel from "@models/recurringPayments.model";


class RecurringPaymentEntity extends BaseEntity {

    constructor(model: Model<any>) {
        super(model);
    }
}

export const RecurringPayV1 = new RecurringPaymentEntity(recurringPaymentModel);