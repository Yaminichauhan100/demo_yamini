/**
 * @file admin.v1.entity
 * @description defines v1 admin entity methods
 * @author Desk Now Dev Team
*/

import { Model } from "mongoose";
import BaseEntity from "../base.entity";
import CityModel from "@models/city.model";
import { Types } from "mongoose"
class CityEntity extends BaseEntity {

    constructor(model: Model<any>) {
        super(model);
    }
    

    async createCity(payload: any) {
        try {
            let city = await new this.model(payload).save();
            return city.toObject();
        } catch (error) {
            console.error(`we have an error in createCity --> ${error}`);
        }
    }

    async fetchUniqueCities(cityIds: Array<any>, payload: any): Promise<any> {
        try {
            let cityArray: any = []
            cityIds.forEach((element: any) => {
                cityArray.push(Types.ObjectId(element))
            });
            const pipeline = [
                {
                    $match: {
                        _id: { $in: cityArray },
                        countryId: payload.countryId
                    }
                }
            ]
            return await this.basicAggregate(pipeline);
        } catch (error) {
            console.error(`we have an error while fetchUniqueCities ==> ${error}`);
        }
    }
}

export const CityV1 = new CityEntity(CityModel);