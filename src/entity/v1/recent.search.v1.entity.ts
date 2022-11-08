/**
 * @file recent.search.v1.entity
 * @description defines v1 recent search entity methods
 * @author Atul
*/

import { Model } from "mongoose";
import BaseEntity from "../base.entity";
import RecentSearchModel from "@models/recent_search.model";

class RecentSearchEntity extends BaseEntity {
    constructor(model: Model<any>) {
        super(model);
    }

    /**
     * @description update recent search data
     * @param details 
     */
    async updateRecentCityList(details: any) {
        try {
            let data = await new this.model(details).save();
            return data;
        } catch (error) {
            console.error(`we have an error while updating recent search => ${error}`);
            return Promise.reject(error);
        }
    }
}

export const RecentSearchV1 = new RecentSearchEntity(RecentSearchModel);