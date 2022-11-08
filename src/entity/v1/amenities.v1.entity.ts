/**
 * @file admin.v1.entity
 * @description defines v1 admin entity methods
 * @author Desk Now Dev Team
*/

import { Model } from "mongoose";

import BaseEntity from "../base.entity";
import AmenitiesModel from "@models/amenities.model";
import builders from "@builders";

class AdminEntity extends BaseEntity {

    constructor(model: Model<any>) {
        super(model);
    }


    async createAmenities(payload: any) {
        let amenities = await new this.model(payload).save();
        return amenities.toObject();
    }

    async checkDuplicateAmenities(name: any) {
        return await AmenitiesModel.aggregate(await builders.Admin.Amenities.duplicateAmenities(name));
    }
    async getAmenitiesList() {
        return await AmenitiesModel.aggregate(await builders.Admin.Amenities.amenitiesList());
    }

    async fetchAmenitiesList(payload: any): Promise<any> {
        try {
            let amenitiesList: Array<any> = await AmenitiesV1.findMany({ _id: { $in: payload.amenities } }, { name: 1, iconImage: 1, type: 1 });

            payload['amenities'] = [];

            for (let i = 0; i < amenitiesList.length; i++) {
                const amenitiesKeys = amenitiesList[i];
                payload.amenities.push({
                    amenityId: amenitiesKeys._id,
                    name: amenitiesKeys.name,
                    iconImage: amenitiesKeys.iconImage,
                    type: amenitiesKeys.type
                })
            };
            return payload;
        } catch (error) {
            console.error(`we have an error while fetching Amenity list ==> ${error}`);
        }
    }
}

export const AmenitiesV1 = new AdminEntity(AmenitiesModel);