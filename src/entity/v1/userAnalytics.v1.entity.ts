/**
 * @file admin.v1.entity
 * @description defines v1 admin entity methods
 * @author Desk Now Dev Team
*/

import { Model } from "mongoose";

import BaseEntity from "../base.entity";
import AnalyticsModel from "@models/userAnalytics.model";

class UserAnalyticsEntity extends BaseEntity {

    constructor(model: Model<any>) {
        super(model);
    }

}

export const UserAnalyticsV1 = new UserAnalyticsEntity(AnalyticsModel);