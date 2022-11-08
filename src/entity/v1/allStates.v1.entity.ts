/**
 * @file admin.v1.entity
 * @description defines v1 admin entity methods
 * @author Desk Now Dev Team
*/

import { Model } from "mongoose";

import BaseEntity from "../base.entity";
import AllStatesModel from "@models/allStates.model";

class AllCityEntity extends BaseEntity {

    constructor(model: Model<any>) {
        super(model);
    }





}

export const AllStatesV1 = new AllCityEntity(AllStatesModel);