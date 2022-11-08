/**
 * @file admin.v1.entity
 * @description defines v1 admin entity methods
 * @author Desk Now Dev Team
*/

import { Model, Types } from "mongoose";
import { Auth } from "@services";
import BaseEntity from "../base.entity";
import AdminModel from "@models/admin.model";
import AdminSessionModel from "@models/admin_session.model";
import { NextFunction } from "express";
import { PropertyV1 } from "./property.details.entity";
import { BookingV1 } from "./booking.v1.entity";

class AdminEntity extends BaseEntity {

    constructor(model: Model<any>) {
        super(model);
    }

    /**
     * creates a new admin
     * @param payload - admin data to insert
     */
    async createAdmin(payload: IAdmin.Request.CreateAdmin): Promise<IAdmin.Admin> {
        payload.password = Auth.hashData('Admin@123', <string>payload.salt);
        let adminData = await new this.model(payload).save();
        return adminData.toObject();
    }

    /**
     * returns hashed password using the salt
     * @param adminData - the admin data
     * @param password - the password to match
     */
    async verifyPassword(adminData: IAdmin.Admin, password: string): Promise<boolean> {
        return adminData['password'] === Auth.hashData(password, <string>adminData.salt);
    }


    /**
     * filters user data for safe response
     * @params adminData
     */
    filterAdminData(adminData: IAdmin.Admin): IAdmin.Admin {
        delete adminData.password;
        delete adminData.salt;
        return adminData;
    }

    /**
     * creates a new session for admin, removes previous session
     * @params payload - admin session data payload
     */
    async createNewSession(payload: any): Promise<IAdmin.AdminSession> {
        payload.adminId = Types.ObjectId(payload.adminId);
        const sessionData: any = await new AdminSessionModel(payload).save();
        return sessionData.toObject();
    }

    /**
     * removes all previous session of admin
     * @params payload - admin session data payload
     */
    async removePreviousSession(id: Types.ObjectId, multi: Boolean): Promise<void> {
        if (multi) await AdminSessionModel.updateMany({ adminId: id, isActive: true }, { isActive: false });
        else await AdminSessionModel.updateOne({ _id: id }, { isActive: false });
    }

    async updateFeaturedProp(propertyId: string, isFeaturedProperty: boolean, next: NextFunction) {
        try {
            const updatedResponse = await PropertyV1.updateEntity({ _id: propertyId }, { isFeaturedProperty: isFeaturedProperty });
            return updatedResponse.data;
        } catch (error) {
            console.error(`we have an error in admin entity ==> ${error}`);
            next(error);
            return Promise.reject(error);
        }
    }

    async fetchBookingDetail(bookingId: string) {
        try {
            let pipeline: any = []
            pipeline.push({ $match: { _id: Types.ObjectId(bookingId) } })
            pipeline.push({
                $project: {
                    propertyData: 1,
                    timing: 1,
                    categoryData : {
                        category : "$category",
                        subCategory : '$subCategory',
          
                      },
                    fromDate: 1,
                    toDate: 1,
                    cartInfo :1,
                    occupancy: 1,
                    userBookingStatus: 1,
                    bookingStatus: 1,
                    createdAt: 1,
                    quantity: 1,
                    price: "$basePrice",
                    totalPrice: "$totalPayable",
                    discount: { $literal: 0 },
                    bookingId: 1,
                    downloadInvoice: { $literal: 'N/A' },
                    acceptedOn: 1,
                    rejectedOn: 1,
                    isEmployee: 1,
                    floorNumber: 1,
                    floorDescription: 1,
                    floorLabel: 1,
                    bookingType: 1,
                    hostInvoice :1, 
                    invoiceUrl :1
                }
            })
            let response = await BookingV1.basicAggregate(pipeline);
            return response;
        } catch (error) {
            console.error(`we have an error in admin entity ==> ${error}`);
        }
    }
}

export const AdminV1 = new AdminEntity(AdminModel);
