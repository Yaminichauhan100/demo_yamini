/**
 * @file partner.v1.entity
 * @description defines v1 partner entity methods
 * @author Desk Now Dev Team
*/

import { Model, Types } from "mongoose";
import BaseEntity from "../base.entity";
import PartnerModel from "@models/employee.model";
import Builders from "@builders";
import { PropertyV1 } from "./property.details.entity";
import { UserV1 } from "./user.v1.entity";
import { PartnerFloorV1 } from "./partner.floor.entity";
import { PropertySpaceV1 } from "./property.spaces.v1.entity";
import { PartnerV1 } from "./partner.v1.entity";
import { ENUM } from "@common";

class EmployeeEntity extends BaseEntity {

    constructor(model: Model<any>) {
        super(model);
    }

    async create(payload: any) {
        let faqData = await new this.model(payload).save();
        return faqData.toObject();
    }

    async fetchAssociatedProperties(payload: any, userId: string): Promise<any> {
        try {
            let propertyIdArray = [];
            const headers: any = payload.headers;

            payload.offset = parseInt(headers.offset);

            const availablePropertyIds = await this.findDistinct("propertyId", { userId: Types.ObjectId(userId) });
            if (availablePropertyIds.length > 0) {
                for (let i = 0; i < availablePropertyIds.length; i++) {
                    propertyIdArray.push(Types.ObjectId(availablePropertyIds[i]));
                }
            }
            let userDetails: any = await UserV1.findOne({ _id: Types.ObjectId(userId) }, { partnerId: 1 });

            let partnerArray: any = [];
            userDetails.partnerId.forEach((element: any) => {
                partnerArray.push(Types.ObjectId(element))
            });

            const availablePropertyPipeline = Builders.User.UserPropertyBuilder.fetchPartnerProperties(payload, userId, propertyIdArray, partnerArray);

            payload['getCount'] = true;

            const availablePropertyListing = await PropertyV1.paginateAggregate(availablePropertyPipeline, payload);

            return availablePropertyListing;
        } catch (error) {
            console.error(`we have an error in fetchAssociatedProperties ==> ${error}`);
        }
    }

    async fetchDistinctPropertyIds(userId: string): Promise<any> {
        try {
            return await this.findDistinct("propertyId", { userId: Types.ObjectId(userId) });
        } catch (error) {
            console.error(`we have an error fetchDistinctPropertyIds ==> ${error}`);
        }
    }

    async fetchDistinctCountryIds(propertyIds: Array<any>): Promise<any> {
        try {
            return await PropertyV1.findDistinct("country._id", { _id: { $in: propertyIds } });
        } catch (error) {
            console.error(`we have an error fetchPropertyWiseCityListing ==> ${error}`);
        }
    }

    async fetchDistinctStateIds(propertyIds: Array<any>): Promise<any> {
        try {
            return await PropertyV1.findDistinct("state._id", { _id: { $in: propertyIds } });
        } catch (error) {
            console.error(`we have an error fetchPropertyWiseCityListing ==> ${error}`);
        }
    }

    async fetchDistinctCityIds(propertyIds: Array<any>): Promise<any> {
        try {
            return await PropertyV1.findDistinct("city._id", { _id: { $in: propertyIds } });
        } catch (error) {
            console.error(`we have an error fetchPropertyWiseCityListing ==> ${error}`);
        }
    }

    async fetchPropertyDetailsFloorWise(payload: any): Promise<any> {
        try {
            const floorPartnerDetails = Builders.User.EmployeePropertyBuilder.employeePropertyDetails(payload);
            const floorListing = await PartnerFloorV1.basicAggregate(floorPartnerDetails)
            return floorListing;
        } catch (error) {
            console.error(`we have an error fetchPropertyDetailsFloorWise ==> ${error}`);
        }
    }

    async fetchEmployeePropertyDetailsViaPropertySpace(payload: any): Promise<any> {
        try {
            const floorPartnerDetails = Builders.User.EmployeePropertyBuilder.employeePropertySpaceDetails(payload);
            const floorListing = await PropertySpaceV1.basicAggregate(floorPartnerDetails)
            return floorListing;
        } catch (error) {
            console.error(`we have an error fetchPropertyDetailsFloorWise ==> ${error}`);
        }
    }

    async fetchUserPropertyDetailsViaPropertySpace(payload: any): Promise<any> {
        try {
            const floorPartnerDetails = Builders.User.EmployeePropertyBuilder.userPropertySpaceDetails(payload);
            const floorListing = await PropertySpaceV1.basicAggregate(floorPartnerDetails)
            return floorListing;
        } catch (error) {
            console.error(`we have an error fetchUserPropertyDetailsViaPropertySpace ==> ${error}`);
        }
    }

    async fetchPropertyDetailsBookingType(payload: any): Promise<any> {
        try {
            let propertyDetails: any = []
            switch (payload.bookingType) {
                case ENUM.USER.BOOKING_TYPE.HOURLY:
                    propertyDetails = await Promise.all([
                        PropertySpaceV1.distinct("floorNumber", { propertyId: Types.ObjectId(payload.propertyId), bookingType: ENUM.USER.BOOKING_TYPE.HOURLY, isEmployee: false, status: ENUM.PROPERTY.STATUS.ACTIVE }),
                        PartnerV1.distinct("partnerFloors", { "property._id": Types.ObjectId(payload.propertyId) })
                    ])
                    return propertyDetails[0].filter((f: any) => !propertyDetails[1].includes(f));
                case ENUM.USER.BOOKING_TYPE.MONTHLY:
                    propertyDetails = await Promise.all([
                        PropertySpaceV1.distinct("floorNumber", { propertyId: Types.ObjectId(payload.propertyId), bookingType: ENUM.USER.BOOKING_TYPE.MONTHLY, isEmployee: false, status: ENUM.PROPERTY.STATUS.ACTIVE }),
                        PartnerV1.distinct("partnerFloors", { "property._id": Types.ObjectId(payload.propertyId) })
                    ])
                    return propertyDetails[0].filter((f: any) => !propertyDetails[1].includes(f));
                case ENUM.USER.BOOKING_TYPE.CUSTOM:
                    propertyDetails = await Promise.all([
                        PropertySpaceV1.distinct("floorNumber", { propertyId: Types.ObjectId(payload.propertyId), bookingType: ENUM.USER.BOOKING_TYPE.CUSTOM, isEmployee: false, status: ENUM.PROPERTY.STATUS.ACTIVE }),
                        PartnerV1.distinct("partnerFloors", { "property._id": Types.ObjectId(payload.propertyId) })
                    ])
                    return propertyDetails[0].filter((f: any) => !propertyDetails[1].includes(f));
                default:
                    propertyDetails = await Promise.all([
                        PropertySpaceV1.distinct("floorNumber", { propertyId: Types.ObjectId(payload.propertyId), isEmployee: false, status: ENUM.PROPERTY.STATUS.ACTIVE }),
                        PartnerV1.distinct("partnerFloors", { "property._id": Types.ObjectId(payload.propertyId) })
                    ])
                    return propertyDetails[0].filter((f: any) => !propertyDetails[1].includes(f));

            }

        } catch (error) {
            console.error(`we have an error fetchUserPropertyDetailsViaPropertySpace ==> ${error}`);
        }
    }

    async fetchPropertyDetailsforEmployee(payload: any): Promise<any> {
        try {
            let floorCount
            switch (payload.bookingType) {
                case ENUM.USER.BOOKING_TYPE.HOURLY:
                    floorCount = await PropertySpaceV1.distinct("floorNumber", { propertyId: Types.ObjectId(payload.propertyId), partnerId: Types.ObjectId(payload.partnerId), bookingType: ENUM.USER.BOOKING_TYPE.HOURLY, isEmployee: true, status: ENUM.PROPERTY.STATUS.ACTIVE })
                    return floorCount
                case ENUM.USER.BOOKING_TYPE.MONTHLY:
                    floorCount = await PropertySpaceV1.distinct("floorNumber", { propertyId: Types.ObjectId(payload.propertyId), partnerId: Types.ObjectId(payload.partnerId), bookingType: ENUM.USER.BOOKING_TYPE.MONTHLY, isEmployee: true, status: ENUM.PROPERTY.STATUS.ACTIVE })
                    return floorCount
                case ENUM.USER.BOOKING_TYPE.CUSTOM:
                    floorCount = await PropertySpaceV1.distinct("floorNumber", { propertyId: Types.ObjectId(payload.propertyId), partnerId: Types.ObjectId(payload.partnerId), bookingType: ENUM.USER.BOOKING_TYPE.CUSTOM, isEmployee: true, status: ENUM.PROPERTY.STATUS.ACTIVE })
                    return floorCount
                default:
                    floorCount = await PropertySpaceV1.distinct("floorNumber", { propertyId: Types.ObjectId(payload.propertyId), partnerId: Types.ObjectId(payload.partnerId), bookingType: ENUM.USER.BOOKING_TYPE.HOURLY, isEmployee: true, status: ENUM.PROPERTY.STATUS.ACTIVE })
                    return floorCount

            }

        } catch (error) {
            console.error(`we have an error fetchUserPropertyDetailsViaPropertySpace ==> ${error}`);
        }
    }
}
export const EmployeeV1 = new EmployeeEntity(PartnerModel);