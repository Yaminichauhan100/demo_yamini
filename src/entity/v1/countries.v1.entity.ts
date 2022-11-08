/**
 * @file admin.v1.entity
 * @description defines v1 admin entity methods
 * @author Desk Now Dev Team
*/

import { Model } from "mongoose";

import BaseEntity from "../base.entity";
import CountriesModel from "@models/countries.model";
import { Types } from "mongoose";

class CountriesEntity extends BaseEntity {

    constructor(model: Model<any>) {
        super(model);
    }
    async fetchUniqueCountries(countryIds: Array<any>): Promise<any> {
        try {
            let countryArray: any = []
            countryIds.forEach((element: any) => {
                countryArray.push(Types.ObjectId(element))
            });
            const pipeline = [
                {
                    $match: { _id: { $in: countryArray } }
                }
            ]
            return await this.basicAggregate(pipeline);
        } catch (error) {
            console.error(`we have an error in fetchUniqueCountries ==> ${error}`);
        }
    }

    async fetchCountryByCountryId(payload: any): Promise<any> {
        try {
            return await this.findOne({ id: payload.countryId }, { name: 1 });
        } catch (error) {
            console.error(`we have an error ==> ${error}`);
        }
    }



}

export const CountriesV1 = new CountriesEntity(CountriesModel);