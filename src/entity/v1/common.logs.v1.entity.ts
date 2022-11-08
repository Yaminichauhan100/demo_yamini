/**
 * @file common.logs.v1.entity
 * @description defines v1 common logs entity methods
 * @author Desk Now Dev Team
*/

import { Model } from "mongoose";
import BaseEntity from "../base.entity";
import CommonLogsModel from "@models/logs.model";

class CalendarEntity extends BaseEntity {
    constructor(model: Model<any>) {
        super(model);
    }

    async createCronLog(type: number, data: any) {
        try {
            await this.createOne({ type, data });
        } catch (error) {
            console.error(`we have an error ==> ${error}`);
        }
    }
}

export const CommonLogsV1 = new CalendarEntity(CommonLogsModel);