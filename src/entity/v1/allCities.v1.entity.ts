/**
 * @file admin.v1.entity
 * @description defines v1 admin entity methods
 * @author Desk Now Dev Team
*/

import { Model } from "mongoose";

import BaseEntity from "../base.entity";
import AllCitiesModel from "@models/allCities.model";

class AllCityEntity extends BaseEntity {
    async createCityByAdmin(payload: any) {
        let createDataPayload = {
            name: payload.cityName,
            state_id: payload.stateId,
            country_id: payload.countryId,
            iconImage: payload.iconImage,
            cityId : payload.cityId
        }
        let city = await new this.model(createDataPayload).save();
        return city.toObject();
    }

    constructor(model: Model<any>) {
        super(model);
    }





}

export const AllCityV1 = new AllCityEntity(AllCitiesModel);