/**
 * @file admin.v1.entity
 * @description defines v1 admin entity methods
 * @author Desk Now Dev Team
*/

import { Model } from "mongoose";
import BaseEntity from "../base.entity";
import StatesModel from "@models/states.model";
import { Types } from "mongoose"
class StatesEntity extends BaseEntity {

    constructor(model: Model<any>) {
        super(model);
    }

    async fetchStateNameByStateId(payload: any): Promise<any> {
        try {
            return await this.findOne({ id: payload.stateId }, { name: 1 })
        } catch (error) {

        }
    }



    async fetchUniqueStates(stateIds: Array<any>, payload: any): Promise<any> {
        try {
            let countryArray: any = []
            stateIds.forEach((element: any) => {
                countryArray.push(Types.ObjectId(element))
            });
            const pipeline = [
                {
                    $match: {
                        _id: { $in: stateIds },
                        country_id: payload.countryId
                    }
                }
            ]
            return await this.basicAggregate(pipeline);
        } catch (error) {
            console.error(`we have an error in fetchUniqueStates ==> ${error}`);
        }
    }

}

export const StatesV1 = new StatesEntity(StatesModel);