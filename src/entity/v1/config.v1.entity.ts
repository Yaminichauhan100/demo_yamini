/**
 * @file admin.v1.entity
 * @description defines v1 admin entity methods
 * @author Desk Now Dev Team
*/

import { Model } from "mongoose";

import BaseEntity from "../base.entity";
import ConfigModel from "@models/config.model";

import { Types } from "mongoose";
import { ENUM_ARRAY } from "@common";


class ConfigEntity extends BaseEntity {

    constructor(model: Model<any>) {
        super(model);
    }

    async partnerTypeList(params: any) {
        let pipeline: any = [];
        let filterConditions: any = [];
        filterConditions.push({ isDeleted: false })
        filterConditions.push({ type: ENUM_ARRAY.CONFIG_TYPE.PARTNER_TYPE })
        if (params.search) {
            filterConditions.push(
                { 'data.title': { $regex: params.search, $options: "si" } }
            );
        }
        if (params.id) filterConditions.push({ _id: Types.ObjectId(params.id) })
        pipeline.push({ $match: { $and: filterConditions } });
        pipeline.push({
            $project: {
                _id: 1,
                type: 1,
                title: '$data.title',
                image: '$data.image',
                createdAt: 1,
                updatedAt: 1
            }
        })
        let details: any = await ConfigV1.paginateAggregate(pipeline, { getCount: true, limit: params && params.limit ? params.limit = parseInt(params.limit) : params.limit = 2, page: params.page });
        return details;
    }

}

export const ConfigV1 = new ConfigEntity(ConfigModel);