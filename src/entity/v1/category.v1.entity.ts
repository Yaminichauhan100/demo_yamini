/**
 * @file admin.v1.entity
 * @description defines v1 admin entity methods
 * @author Desk Now Dev Team
*/

import { Model, Types } from "mongoose";

import BaseEntity from "../base.entity";
import CategoryModel from "@models/category.model";
import Builder from "@builders"
import { redisDOA } from "@services";
import { DATABASE } from "@common";

class CategoryEntity extends BaseEntity {

    constructor(model: Model<any>) {
        super(model);
    }


    async createCategory(payload: any) {

        if (payload.parentId && payload.parentId != '') {
            payload.parentId = Types.ObjectId(payload.parentId)
        } else {
            delete payload.parentId
        }

        let category = await new this.model(payload).save();
        return category.toObject();
    }

    // function to get category and subactegoty 
    async getCategoryAndSubCategory() {
        return await CategoryModel.aggregate(await Builder.Admin.Category.categoryAndSubCategoryDetails());
    }
        // function to get duplicate category and subactegoty 
    async checkDuplicateCategory(name:string) {
        return await CategoryModel.aggregate(await Builder.Admin.Category.duplicateCategory(name));
    }

    async getCtegoriesSubCategoriesListFromRedis() {
        return await redisDOA.getKeyFromRedisHash(DATABASE.REDIS.KEY_NAMES.CATEGORY_AMENITIES,DATABASE.REDIS.KEY_NAMES.CATEGORY_SUBACTEGORIES_HASH)
    }

}

export const CategoryV1 = new CategoryEntity(CategoryModel);