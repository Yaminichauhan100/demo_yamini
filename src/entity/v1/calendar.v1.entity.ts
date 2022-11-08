/**
 * @file admin.v1.entity
 * @description defines v1 admin entity methods
 * @author Desk Now Dev Team
*/

import { Model } from "mongoose";
import BaseEntity from "../base.entity";
import CalendarModel from "@models/calendar.model";

class CalendarEntity extends BaseEntity {
    constructor(model: Model<any>) {
        super(model);
    }
}

export const CalendarV1 = new CalendarEntity(CalendarModel);