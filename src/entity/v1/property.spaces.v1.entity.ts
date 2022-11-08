/**
 * @file property.spaces.v1.entity
 * @description defines v1 admin entity methods
 * @author Desk Now Dev Team
*/

import { Model, Types } from "mongoose";

import BaseEntity from "../base.entity";
import PropertySpaceModel from "@models/propertySpaces.model"
import { HostV1, OPriceV1, PropertyV1 } from "@entity";
import { handleEntityResponse } from "@baseController";
import { ENUM, RESPONSE } from "@common";
import { PartnerFloorV1 } from "./partner.floor.entity";
import { PartnerV1 } from "./partner.v1.entity";
import { EmployeeV1 } from "./employee.v1.entity";
import { NextFunction } from "express";

class SpaceEntity extends BaseEntity {

    constructor(model: Model<any>) {
        super(model);
    }


    async createPropertySpace(payload: any) {
        try {
            let floorDetail = await new this.model(payload).save();
            return floorDetail;
        } catch (error) {
            console.error(`we have an error while createPropertySpace ==> ${error}`);
        }
    }

    async addFloors(addPropertyResponse: any, payload: IProperty.AddProperty, res: any, headers: any): Promise<any> {
        try {
            if (payload?.status == ENUM.PROPERTY.STATUS.ACTIVE && payload?.floorDetails?.length < 0) {
                return handleEntityResponse.sendResponse(res, RESPONSE.PROPERTY(res.locals.lang).INCOMPLETE_FLOOR_DETAILS);
            }
            let totalCapacity: number = 0;
            if (payload?.floorDetails?.length) {
                for (let floorNumber = 0; floorNumber < payload.floorDetails.length; floorNumber++) {
                    console.log("no. of time loops been called .....", totalCapacity)
                    const floorDetail: any = payload.floorDetails[floorNumber];
                    floorDetail['propertyId'] = addPropertyResponse._id;
                    floorDetail['propertyName'] = addPropertyResponse.name;
                    totalCapacity = totalCapacity+ floorDetail.capacity;
                    await this.addFloor(floorDetail, res, headers);
                }
            }
            console.log("=>>>>>>>>>>>>>>>>>>>> total capacity", totalCapacity)
            await PropertyV1.updateOne({ _id: Types.ObjectId(addPropertyResponse._id) }, {
                $set: {
                    totalCapacity: totalCapacity,
                }
            });
        } catch (error) {
            console.error(`we have an error while adding floors ==> ${error}`);
        }
    }

    async addFloor(payload: any, res: any, headers: any): Promise<any> {
        try {
            let offset: any = headers.offset;
            let spaceDetail = await HostV1.addPropertySpace(payload);
            if (!spaceDetail) {
                return handleEntityResponse.sendResponse(res, RESPONSE.HOST(res.locals.lang).DUPLICATE_SPACE_ID);
            }
            //TODO fetch common spaceId of same subCategory and floorNumber.
            // and push the spaceId to the array itself.
            if (payload.offerPrice && payload.offerPrice.length > 0) {
                await OPriceV1.saveMultipleOfferPrice(payload.offerPrice, spaceDetail._id, spaceDetail.propertyId, parseInt(offset));
            }
            PropertyV1.updateOne({ _id: Types.ObjectId(payload?.propertyId) },
                {
                    $inc: { totalUnits: parseInt(payload?.units)}
                });
        } catch (error) {
            console.error(`we have an error while add Space entity ==> ${error}`);
        }
    }



    async updateFloors(addPropertyResponse: any, payload: any, res: any, headers: any, next: NextFunction): Promise<any> {
        try {
            let activeFloors: any = [];
            let activeFloorsNumber: any = []
            let totalCapacity: number = 0;
            for (let floorNumber = 0; floorNumber < payload.floorDetails.length; floorNumber++) {
                const floorDetail: any = payload.floorDetails[floorNumber];
                floorDetail['propertyId'] = addPropertyResponse._id;
                totalCapacity += floorDetail.capacity;
                activeFloorsNumber.push(floorDetail.floorNumber);
                const updatedFloors = await this.updateFloor(floorDetail, res, headers, next);
                activeFloors.push(updatedFloors);
            }
            if (activeFloors?.length > 0) {
                await Promise.all([
                    PropertySpaceV1.update({ propertyId: Types.ObjectId(addPropertyResponse._id), _id: { $nin: activeFloors } }, { $set: { status: ENUM.PROPERTY_SPACE.STATUS.ISDELETE } }),
                    PartnerFloorV1.update({ propertyId: Types.ObjectId(addPropertyResponse._id), spaceId: { $nin: activeFloors } }, { $set: { status: ENUM.PROPERTY_SPACE.STATUS.ISDELETE } }),
                    PropertyV1.updateOne({ _id: Types.ObjectId(addPropertyResponse._id) }, {
                        $set: {
                            totalCapacity: totalCapacity,
                        }
                    }),
                ])
            }
        } catch (error) {
            console.error(`we have an error while updateFloors entity ==> ${error}`);
            next(error);
        }
    }

    async updatePartnersAssociatedWithProperty(payload: any): Promise<any> {
        try {
            let findPartners: any = await PartnerV1.findMany({ "property._id": Types.ObjectId(payload) })
            let concatArray: any = []
            let removePartnerArray: any = []
            for (let i = 0; i < findPartners.length; i++) {
                let partialFloorDetails: any = await PartnerFloorV1.findOne({ partnerId: Types.ObjectId(findPartners[i]._id), status: ENUM.PROPERTY.STATUS.ACTIVE })
                if (partialFloorDetails) concatArray = findPartners[i]?.partnerFloors?.concat(partialFloorDetails.partnerFloors)
                else concatArray = findPartners[i]?.partnerFloors

                if (concatArray.length == 0) removePartnerArray.push(Types.ObjectId(findPartners[i]._id))
            }
            await Promise.all([
                PartnerV1.removeAll({ _id: { $in: removePartnerArray } }),
                EmployeeV1.removeAll({ partnerId: { $in: removePartnerArray } })
            ])

        } catch (error) {
            console.error(`we have an error while updatePartnersAssociatedWithFloors entity ==> ${error}`);
            throw error;
        }
    }

    async updateFloor(floorDetail: any, res: any, headers: any, next: NextFunction): Promise<any> {
        try {
            let payload = floorDetail;
            let offset = headers.offset;

            const [capacityFromDb, response]: any = await Promise.all([
                PropertySpaceV1.findOne({ _id: Types.ObjectId(payload.floorId) }),
                HostV1.updatePropertySpace(payload, res, next)
            ])
            //console is to verify the capacity from db
            console.log(`capacityFromDb ==>`, capacityFromDb);

            if (!response) return handleEntityResponse.sendResponse(res, RESPONSE.HOST(res.locals.lang).DUPLICATE_SPACE_ID);

            if (payload?.offerPrice?.length > 0 && payload?.isOfferPrice) {
                await OPriceV1.updateMultipleOfferPrice(payload.offerPrice, response._id, response.propertyId, offset)
            }
            return response?._id;
        } catch (error) {
            console.error(`we have an error while updateFloor entity ==> ${error}`);
        }
    }

}

export const PropertySpaceV1 = new SpaceEntity(PropertySpaceModel);