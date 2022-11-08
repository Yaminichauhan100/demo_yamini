/**
 * @file admin.v1.entity
 * @description defines v1 admin entity methods
 * @author Desk Now Dev Team
*/

import { Model } from "mongoose";

import BaseEntity from "../base.entity";
import favouriteModel from "@models/favourite.model";


class FavouriteEntity extends BaseEntity {

    constructor(model: Model<any>) {
        super(model);
    }
  
}

export const FavouriteV1 = new FavouriteEntity(favouriteModel);