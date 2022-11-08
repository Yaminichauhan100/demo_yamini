/**
 * @file user.v1.entity
 * @description defines v1 user entity methods
 * @created 2019-08-25 23:24:06
 * @author Desk Now Dev Team
*/

import { Model, Types } from "mongoose";
import BaseEntity from "../base.entity";
import BookingCartModel from "@models/booking.cart.model";
import { calculateBestOfferPrice, calculateCartPrice, formattedTime as formattedTime, roundOffNumbers } from "@services";
import { PayV1, PropertySpaceV1, PropertyV1, UserV1 } from "@entity";
import { CONSTANT, DATABASE, ENUM } from "@common";
import { NextFunction } from "express";
import moment from "moment";
import { HostV1 } from "./host.v1.entity";
import { PropertyDetails } from "typings/property.typings";
import { PropertySpaceDetails } from "typings/propertySpace.typings";
import { UserDetails } from "typings/user.typings";

class UserCartEntity extends BaseEntity {
    constructor(model: Model<any>) {
        super(model);
    }
    /**
     * @description common method for cart management add/remove
     * @param payload 
     * @param headers 
     * @param next
     */
    async addtoBookingCart(payload: any, headers: any, next: NextFunction, userDetail: any, propertyDetail: any, spacePrice: any, offerPriceOfCategory: any) {
        try {
            let deviceId = headers.devicedetails.deviceId;
            payload['deviceId'] = deviceId;
            payload['tax'] = propertyDetail ?.state ?.tax ? propertyDetail ?.state ?.tax : propertyDetail ?.country ?.tax;

            let criteriaForDuplicateSpace = {
                "propertyData.propertyId": Types.ObjectId(payload.propertyId),
                "cartInfo.spaceId": { $in: payload.spaceIds },
            }

            let checkDuplicateItems = await BookingCartV1.findOne(criteriaForDuplicateSpace);
            let { endDate, startDate } = formattedTime({ fromDate: payload.fromDate, toDate: payload.toDate });

            endDate = moment(payload.toDate).add(payload.offset, "minute").toDate();
            startDate = moment(payload.fromDate).add(payload.offset, "minute").toDate();

            let calculatedPrice = await this.fetchCalculatedPrice(spacePrice, payload, payload['tax'], endDate, startDate, payload.quantity, spacePrice.pricing, offerPriceOfCategory);

            let cartInfo: any = []
            let totalSpaceCapacity: number = 0
            for (let i = 0; i < spacePrice.length; i++) {
                let basePrice = 0;
                switch (payload ?.bookingType) {
                    case ENUM.USER.BOOKING_TYPE.CUSTOM:
                        basePrice = calculatedPrice.bookingDuration.totalDays * spacePrice[i].pricing.daily 
                        break;
                    case ENUM.USER.BOOKING_TYPE.HOURLY:
                        basePrice = payload.totalHours * spacePrice[i].pricing.hourly
                        break;
                    case ENUM.USER.BOOKING_TYPE.MONTHLY:
                        basePrice = payload.totalMonths * spacePrice[i].pricing.monthly
                        break;
                }
                cartInfo.push({
                    spaceId: spacePrice[i]?._id,
                    pricing: spacePrice[i].pricing,
                    basePrice: basePrice,
                    spaceLabel:spacePrice[i]?.spaceLabel,
                    position :spacePrice[i].position,
                    gridRow :spacePrice[i].gridRow,
                    gridColumn :spacePrice[i].gridColumn,
                    floorImage :spacePrice[i].floorImage
                })
                totalSpaceCapacity = totalSpaceCapacity + spacePrice[i].capacity
            }

            let dataToInsert = {
                deviceId: deviceId,
                quantity: payload.quantity,
                cartInfo: cartInfo,
                totalSpaceCapacity: totalSpaceCapacity,
                fromDate: moment(payload.fromDate).toISOString(),
                toDate: moment(payload.toDate).toISOString(),
                totalPayable: calculatedPrice.offerPrice ? calculatedPrice.totalPayable - calculatedPrice ?.offerPrice : calculatedPrice.totalPayable,
                monthlyPayable: calculatedPrice.offerPrice && calculatedPrice.monthlyPricing ?
                    ((calculatedPrice.monthlyPricing * calculatedPrice.bookingDuration ?.months) - calculatedPrice ?.offerPrice) / calculatedPrice.bookingDuration ?.months :
                        calculatedPrice.monthlyPricing,
                shareUrl: propertyDetail?.shareUrl,
                offerPrice: calculatedPrice ?.offerPrice ? calculatedPrice ?.offerPrice : 0,
                offerLabelType: calculatedPrice ?.offerPricingObj ? calculatedPrice ?.offerPricingObj : {},
                taxes: calculatedPrice.taxes,
                taxPercentage: payload['tax'],
                userData: {
                    userId: userDetail?._id,
                    status: userDetail.status,
                    name: userDetail.name,
                    image: userDetail.image ? userDetail ?.image : "",
                    phoneNo: userDetail.phoneNo,
                    countryCode: userDetail.countryCode,
                    createdAt: userDetail.createdAt,
                    email: userDetail.email,
                    profileStatus: userDetail.profileStatus,
                    bio: userDetail.bio,
                },
                propertyData: {
                    propertyId: propertyDetail._id ? propertyDetail._id : "",
                    status: propertyDetail.status ? propertyDetail.status : "",
                    name: propertyDetail.name ? propertyDetail.name : "",
                    images: propertyDetail.images ? propertyDetail.images : "",
                    address: propertyDetail.address ? propertyDetail.address : "",
                    autoAcceptUpcomingBooking: propertyDetail.autoAcceptUpcomingBooking,
                    hostName: propertyDetail.userData.name,
                    hostImage: propertyDetail.userData.image,
                    hostEmail: propertyDetail.userData.email
                },
                hostId: propertyDetail.userData.userId,
                basePrice: calculatedPrice.totalPrice,
                bookingDuration: {
                    year: calculatedPrice ?.bookingDuration ?.year ? calculatedPrice.bookingDuration ?.year : 0,
                    months: calculatedPrice ?.bookingDuration ?.months ? calculatedPrice ?.bookingDuration ?.months : 0,
                    days: calculatedPrice ?.bookingDuration ?.days ? calculatedPrice ?.bookingDuration ?.days : 0,
                    totalDays: calculatedPrice ?.bookingDuration ?.totalDays ? calculatedPrice ?.bookingDuration ?.totalDays : 0,
                    totalHours: calculatedPrice ?.bookingDuration ?.totalHours ? calculatedPrice ?.bookingDuration ?.totalHours : 0
                },
                floorDescription: spacePrice[0].floorDescription,
                floorNumber: spacePrice[0].floorNumber,
                floorLabel: spacePrice[0].floorLabel,
                bookingType: payload ?.bookingType,
                category: spacePrice[0].category,
                subCategory: spacePrice[0].subCategory,
                adminCommissionAmount: payload?.adminCommissionAmount?.commissionAmount,
            };

            console.log("dataToInsert", dataToInsert)
            let bookingData 
            if (checkDuplicateItems) {
               bookingData = await BookingCartV1.updateDocument(criteriaForDuplicateSpace,
                    dataToInsert,
                    { upsert: false , new:true});
            }
            else { 
             bookingData = await new this.model(dataToInsert).save(); }
           let response: any = await this.spaceCartResponse(spacePrice, payload, calculatedPrice,bookingData, totalSpaceCapacity);
            return response;
        } catch (error) {
            console.error(`we have an error in booking cart ==> ${error}`);
            next(error);
        }
    }

    async spaceCartResponse(spacePrice: any, payload: any, calculatedPrice:any,bookingData:any, totalSpaceCapacity?:any): Promise<any> {
        try {
            let cart = {
                quantity: bookingData?.quantity,
                _id: bookingData?._id, 
                startDate: bookingData?.startDate,
                endDate: bookingData?.endDate,
                deviceId: bookingData?.deviceId, 
                userId: bookingData?.userId,
                offerPrice: bookingData?.offerPrice,
                offerLabelType: bookingData?.offerLabelType,
                taxes: bookingData?.taxes,
                totalPayable: bookingData?.totalPayable,
                cartInfo: bookingData?.cartInfo,
                basePrice: bookingData?.basePrice, 
                pricing: bookingData?.pricing
               }
                let response = [{
                    _id:spacePrice[0].category._id,
                data:[{
                category: spacePrice[0].category,
                subCategory: spacePrice[0].subCategory,
                maxQuantity: spacePrice.length,
                cartDetails: cart,
                occupancy: totalSpaceCapacity,
                offerPrice: bookingData.offerPrice,
                taxPercentage: payload['tax'],
                bookingDuration: {
                    year: calculatedPrice.bookingDuration ?.year,
                    months: calculatedPrice.bookingDuration ?.months,
                    days: calculatedPrice.bookingDuration ?.days,
                    totalDays: calculatedPrice.bookingDuration ?.totalDays,
                    totalHours: calculatedPrice.bookingDuration ?.totalHours
                },
                isEmployee: spacePrice[0].isEmployee,
                spaceAvailability: payload.availableUnits,
                floorDescription: spacePrice[0].floorDescription,
                floorNumber: spacePrice[0].floorNumber,
                floorLabel: spacePrice[0].floorLabel,
                partnerId: Types.ObjectId( payload?.partnerId)
            }]
               }]
               return response;
        } catch (error) {
            console.error(`we have an error in spaceCartResponse ==> ${error}`);
        }
    }

    async addToProlongedCart(payload: any, headers: any, next: NextFunction, userDetail: any, propertyDetail: any, spacePrice: any) {
        try {
            let deviceId = headers.devicedetails.deviceId;
            payload['deviceId'] = deviceId;
            payload['tax'] = propertyDetail ?.state ?.tax ? propertyDetail ?.state ?.tax : propertyDetail ?.country ?.tax;

            let criteriaForDuplicateSpace = {
                "propertyData.propertyId": Types.ObjectId(payload.propertyId),
                "cartInfo.spaceId": { $in: payload.spaceIds }
            }

            let checkDuplicateItems = await BookingCartV1.findOne(criteriaForDuplicateSpace);
            let { endDate, startDate } = formattedTime({ fromDate: payload.fromDate, toDate: payload.toDate });

            endDate = moment(payload.toDate).add(payload.offset, "minute").toDate();
            startDate = moment(payload.fromDate).add(payload.offset, "minute").toDate();

            let calculatedPrice = await this.fetchCalculatedPrice(spacePrice, payload, payload['tax'], endDate, startDate, payload.quantity, spacePrice.pricing, spacePrice.offerPricingArray);
            let cartInfo: any = []
            let totalSpaceCapacity: number = 0
            console.log("here to e", calculatedPrice)
            for (let i = 0; i < spacePrice.length; i++) {
                let basePrice = 0;
                switch (payload ?.bookingType) {
                    case ENUM.USER.BOOKING_TYPE.CUSTOM:
                        basePrice = calculatedPrice.bookingDuration.totalDays * spacePrice[i].pricing.daily 
                        break;
                    case ENUM.USER.BOOKING_TYPE.HOURLY:
                        basePrice = payload.totalHours * spacePrice[i].pricing.hourly
                        break;
                    case ENUM.USER.BOOKING_TYPE.MONTHLY:
                        basePrice = payload.totalMonths * spacePrice[i].pricing.monthly
                        break;
                }
                cartInfo.push({
                    spaceId: spacePrice[i]._id,
                    pricing: spacePrice[i].pricing,
                    basePrice: basePrice,
                    spaceLabel:spacePrice[i]?.spaceLabel 
                })
                totalSpaceCapacity = totalSpaceCapacity + spacePrice[i].capacity
            }
            let dataToInsert = {
                deviceId: deviceId,
                quantity: payload.quantity,
                cartInfo:cartInfo,
                totalSpaceCapacity: totalSpaceCapacity,
                fromDate: moment(payload.fromDate).toISOString(),
                toDate: moment(payload.toDate).toISOString(),
                totalPayable: calculatedPrice.offerPrice ? calculatedPrice.totalPayable - calculatedPrice ?.offerPrice : calculatedPrice.totalPayable,
                monthlyPayable: calculatedPrice.offerPrice ?
                    ((calculatedPrice.monthlyPricing * calculatedPrice.bookingDuration ?.months) - calculatedPrice ?.offerPrice) / calculatedPrice.bookingDuration ?.months :
                        calculatedPrice.monthlyPricing,
                shareUrl: propertyDetail.shareUrl,
                offerPrice: calculatedPrice ?.offerPrice ? calculatedPrice ?.offerPrice : 0,
                offerLabelType: calculatedPrice ?.offerPricingObj ? calculatedPrice ?.offerPricingObj : {},
                taxes: calculatedPrice.taxes,
                taxPercentage: payload['tax'],
                userData: {
                    userId: userDetail._id,
                    status: userDetail.status,
                    name: userDetail.name,
                    image: userDetail.image ? userDetail ?.image : "",
                    phoneNo: userDetail.phoneNo,
                    countryCode: userDetail.countryCode,
                    createdAt: userDetail.createdAt,
                    email: userDetail.email,
                    profileStatus: userDetail.profileStatus
                },
                propertyData: {
                    propertyId: propertyDetail._id ? propertyDetail._id : "",
                    status: propertyDetail.status ? propertyDetail.status : "",
                    name: propertyDetail.name ? propertyDetail.name : "",
                    images: propertyDetail.images ? propertyDetail.images : "",
                    address: propertyDetail.address ? propertyDetail.address : "",
                    autoAcceptUpcomingBooking: propertyDetail.autoAcceptUpcomingBooking,
                    hostName: propertyDetail.userData.name,
                    hostImage: propertyDetail.userData.image,
                    hostEmail: propertyDetail.userData.email
                },
                hostId: propertyDetail.userData.userId,
                basePrice: calculatedPrice.totalPrice,
                bookingDuration: {
                    year: calculatedPrice ?.bookingDuration ?.year ? calculatedPrice.bookingDuration ?.year : 0,
                    months: calculatedPrice ?.bookingDuration ?.months ? calculatedPrice ?.bookingDuration ?.months : 0,
                    days: calculatedPrice ?.bookingDuration ?.days ? calculatedPrice ?.bookingDuration ?.days : 0,
                    totalDays: calculatedPrice ?.bookingDuration ?.totalDays ? calculatedPrice ?.bookingDuration ?.totalDays : 0,
                    totalHours: calculatedPrice ?.bookingDuration ?.totalHours ? calculatedPrice ?.bookingDuration ?.totalHours : 0
                },
                floorDescription: spacePrice[0].floorDescription,
                floorNumber: spacePrice[0].floorNumber,
                floorLabel: spacePrice[0].floorLabel,
                bookingType: payload ?.bookingType,
                category: spacePrice[0].category,
                subCategory: spacePrice[0].subCategory,
                adminCommissionAmount: payload?.adminCommissionAmount?.commissionAmount,
            };
            let bookingData 
            if (checkDuplicateItems) {
                bookingData =     await BookingCartV1.updateDocument(criteriaForDuplicateSpace,
                    dataToInsert,
                    { upsert: false });
            }
            else {  bookingData =await new this.model(dataToInsert).save(); }
            let response: any = await this.prolongSpaceCartResponse(spacePrice, payload, calculatedPrice,bookingData, totalSpaceCapacity);
            return response;
        } catch (error) {
            console.error(`we have an error in addToProlongedCart ==> ${error}`);
            next(error);
        }
    }

    async fetchCalculatedPrice(spacePrice: any, payload: any, tax: any, endDate: any, startDate: any, quantity: any, pricing: any, offerPriceOfCategory: any): Promise<any> {
        try {
            switch (payload ?.bookingType) {
                case ENUM.USER.BOOKING_TYPE.CUSTOM:
                    return await calculateCartPrice(tax, endDate, startDate, quantity, pricing, offerPriceOfCategory, spacePrice);
                case ENUM.USER.BOOKING_TYPE.HOURLY:
                    return await this.calculateHourlyCartPrice(payload, endDate, startDate, spacePrice, offerPriceOfCategory);
                case ENUM.USER.BOOKING_TYPE.MONTHLY:
                    return await this.calculateMonthlyCartPrice(payload, endDate, startDate, spacePrice, offerPriceOfCategory);
            }
        } catch (error) {
            console.error(`we have an error in fetchCalculatedPrice ==> ${error}`);
        }
    }

    async calculateHourlyCartPrice(payload: any, endDate: any, startDate: any, spacePrice: any, offerPriceOfCategory: any): Promise<any> {
        try {
            if (offerPriceOfCategory?.length > 0) {
                console.log("insiede")
                let price: any = 0
                for (let i = 0; i < spacePrice.length; i++)
                    price = price + spacePrice[i] ?.pricing ?.hourly;
                let pricing = {
                    hourly: payload.totalHours * price
                }

                let calculatedPrice: any = {
                    totalPrice: pricing.hourly,
                    basePrice: pricing.hourly,
                    hourlyPricing: pricing.hourly,
                    bookingDuration: {
                        totalHours: payload.totalHours
                    }
                }

                await calculateBestOfferPrice(calculatedPrice, offerPriceOfCategory, payload.quantity);

                if (Object.keys(calculatedPrice.offerMap).length >= 1) {
                    if (Object.keys(calculatedPrice.offerMap).length == 1) {
                        calculatedPrice['offerMap'] = calculatedPrice.offerMap;
                    }
                    else {
                        calculatedPrice['offerMap'] = Object.keys(calculatedPrice.offerMap).reduce(function (a, b): any {
                            return calculatedPrice.offerMap[a] > calculatedPrice.offerMap[b] ?
                                { [a]: calculatedPrice.offerMap[a] } :
                                { [b]: calculatedPrice.offerMap[b] }
                        })
                    }
                }
                else {
                    delete calculatedPrice.offerMap;
                    delete calculatedPrice.offerPricingObj;
                    delete calculatedPrice.priceRange;

                    let taxes: number = payload.tax ? payload.tax * (calculatedPrice ?.totalPrice) / CONSTANT.TAXES.DIVISOR : CONSTANT.TAXES.BASIC * calculatedPrice ?.totalPrice / CONSTANT.TAXES.DIVISOR;

                    calculatedPrice['hourlyPricing'] = pricing.hourly > 1 ? pricing.hourly + CONSTANT.TAXES.BASIC * pricing.hourly / CONSTANT.TAXES.DIVISOR : 0;

                    calculatedPrice['totalPayable'] = pricing.hourly + taxes;

                    calculatedPrice['taxes'] = taxes;

                    return calculatedPrice;
                }
                for (let i = calculatedPrice.offerPricingObj.offerPricing.priceDetails.length - 1; i >= 0; --i) {
                    const offerPricingElement = calculatedPrice.offerPricingObj.offerPricing.priceDetails[i];
                    if (offerPricingElement.discountLabelType == Object.keys(calculatedPrice.offerMap)) {
                        calculatedPrice['offerPricingObj'] = offerPricingElement;
                        calculatedPrice['offerPrice'] = Object.values(calculatedPrice.offerMap)[0];
                        break;
                    }
                }
                console.log("calculate price")
                let taxes: number = payload.tax ? payload.tax * (calculatedPrice ?.totalPrice - calculatedPrice.offerPrice) / CONSTANT.TAXES.DIVISOR : CONSTANT.TAXES.BASIC * calculatedPrice ?.totalPrice / CONSTANT.TAXES.DIVISOR;

                calculatedPrice['hourlyPricing'] = pricing.hourly > 1 ? pricing.hourly + CONSTANT.TAXES.BASIC * pricing.hourly / CONSTANT.TAXES.DIVISOR : 0;

                calculatedPrice['totalPayable'] = pricing.hourly + taxes;

                calculatedPrice['taxes'] = taxes;

                return calculatedPrice;
            } else {
                console.log("spacePrice---->",spacePrice)
                let price: any = 0
                for (let i = 0; i < spacePrice.length; i++)
                    price = price + spacePrice[i] ?.pricing ?.hourly;
                let pricing = {
                    hourly: payload.totalHours * price
                }

                let calculatedPrice: any = {
                    totalPrice: pricing.hourly,
                    basePrice: pricing.hourly,
                    hourlyPricing: pricing.hourly,
                    bookingDuration: {
                        totalHours: payload.totalHours
                    }
                }

                let taxes: number = payload.tax ? payload.tax * calculatedPrice ?.totalPrice / CONSTANT.TAXES.DIVISOR : CONSTANT.TAXES.BASIC * calculatedPrice ?.totalPrice / CONSTANT.TAXES.DIVISOR;

                calculatedPrice['hourlyPricing'] = pricing.hourly > 1 ? pricing.hourly + CONSTANT.TAXES.BASIC * pricing.hourly / CONSTANT.TAXES.DIVISOR : 0;
                calculatedPrice['totalPayable'] = pricing.hourly + taxes;
                calculatedPrice['taxes'] = taxes;
                return calculatedPrice;
            }
        } catch (error) {
            console.error(`we have an error in calculateHourlyCartPrice ==> ${error}`);
        }
    }

    async calculateMonthlyCartPrice(payload: any, endDate: any, startDate: any, spacePrice: any, offerPriceOfCategory: any): Promise<any> {
        try {
            if (offerPriceOfCategory ?.length > 0) {
                let price: any = 0
                for (let i = 0; i < spacePrice.length; i++)
                    price = price + spacePrice[i] ?.pricing ?.monthly;
                let pricing = {
                    totalMonthly: payload.totalMonths * price
                }

                let calculatedPrice: any = {
                    totalPrice: pricing.totalMonthly,
                    basePrice: pricing.totalMonthly, 
                    monthlyPricing: pricing.totalMonthly,
                    bookingDuration: {
                        months: payload ?.totalMonths
                    }
                }

                await calculateBestOfferPrice(calculatedPrice, offerPriceOfCategory, payload ?.quantity);

                if (Object.keys(calculatedPrice.offerMap).length >= 1) {
                    if (Object.keys(calculatedPrice.offerMap).length == 1) {
                        calculatedPrice['offerMap'] = calculatedPrice.offerMap;
                    }
                    else {
                        calculatedPrice['offerMap'] = Object.keys(calculatedPrice.offerMap).reduce(function (a, b): any {
                            return calculatedPrice.offerMap[a] > calculatedPrice.offerMap[b] ?
                                { [a]: calculatedPrice.offerMap[a] } :
                                { [b]: calculatedPrice.offerMap[b] }
                        })
                    }
                }
                else {
                    delete calculatedPrice.offerMap;
                    delete calculatedPrice.offerPricingObj;
                    delete calculatedPrice.priceRange;

                    let taxes: number = payload ?.tax ? payload ?.tax * (calculatedPrice.totalPrice - calculatedPrice.offerPrice) / CONSTANT.TAXES.DIVISOR : CONSTANT.TAXES.BASIC * calculatedPrice.totalPrice / CONSTANT.TAXES.DIVISOR;

                    calculatedPrice['totalPayable'] = pricing.totalMonthly + taxes;

                    calculatedPrice['taxes'] = taxes;

                    return calculatedPrice;
                }

                for (let i = calculatedPrice.offerPricingObj.offerPricing.priceDetails.length - 1; i >= 0; --i) {
                    const offerPricingElement = calculatedPrice.offerPricingObj.offerPricing.priceDetails[i];
                    if (offerPricingElement.discountLabelType == Object.keys(calculatedPrice.offerMap)) {
                        calculatedPrice['offerPricingObj'] = offerPricingElement;
                        calculatedPrice['offerPrice'] = Object.values(calculatedPrice.offerMap)[0];
                        break;
                    }
                }
                let taxes: number = payload ?.tax ? payload ?.tax * (calculatedPrice.totalPrice - calculatedPrice.offerPrice) / CONSTANT.TAXES.DIVISOR : CONSTANT.TAXES.BASIC * calculatedPrice.totalPrice / CONSTANT.TAXES.DIVISOR;

                calculatedPrice['totalPayable'] = pricing.totalMonthly + taxes;

                calculatedPrice['taxes'] = taxes;

                if (calculatedPrice.bookingDuration.months >= 2) {
                    calculatedPrice['monthlyPricing'] = await roundOffNumbers(calculatedPrice.totalPayable / payload ?.totalMonths);
                }
                else {
                    calculatedPrice['monthlyPricing'] = 0;
                }
                return calculatedPrice;
            } else {
                let price: any = 0
                for (let i = 0; i < spacePrice.length; i++)
                    price = price + spacePrice[i] ?.pricing ?.monthly;
                let pricing = {
                    totalMonthly: payload.totalMonths * price
                }


                let calculatedPrice: any = {
                    totalPrice: pricing.totalMonthly,
                    basePrice: pricing.totalMonthly,
                    monthlyPricing: pricing.totalMonthly,
                    bookingDuration: {
                        months: payload ?.totalMonths,
                    }
                }

                let taxes: number = payload ?.tax ? payload ?.tax * calculatedPrice.totalPrice / CONSTANT.TAXES.DIVISOR : CONSTANT.TAXES.BASIC * calculatedPrice.totalPrice / CONSTANT.TAXES.DIVISOR;

                calculatedPrice['totalPayable'] = pricing.totalMonthly + taxes;
                calculatedPrice['taxes'] = taxes;
                if (calculatedPrice.bookingDuration.months >= 2) {
                    calculatedPrice['monthlyPricing'] = await roundOffNumbers(calculatedPrice.totalPayable / payload ?.totalMonths);
                }
                else {
                    calculatedPrice['monthlyPricing'] = 0;
                }
                return calculatedPrice;
            }
        } catch (error) {
            console.error(`we have an error in calculateMonthlyCartPrice ==> ${error}`);
        }
    }

    async addtoGuestBookingCart(payload: any, headers: any, next: any, propertyDetail: any, spacePrice: any, offerPriceOfCategory:any) {
        try {
            const deviceId = headers.devicedetails.deviceId;
            payload['deviceId'] = deviceId;
            payload['tax'] = propertyDetail ?.state ?.tax ? propertyDetail ?.state ?.tax : propertyDetail.country.tax;;
            let criteriaForDuplicateSpace = {
                "propertyData.propertyId": Types.ObjectId(payload.propertyId),
                "cartInfo.spaceId": { $in: payload.spaceIds },
            }

            let checkDuplicateItems = await BookingCartV1.findOne(criteriaForDuplicateSpace);
            let { endDate, startDate } = formattedTime({ fromDate: payload.fromDate, toDate: payload.toDate });

            endDate = moment(payload.toDate).add(payload.offset, "minute").toDate();
            startDate = moment(payload.fromDate).add(payload.offset, "minute").toDate();

            let calculatedPrice = await this.fetchCalculatedPrice(spacePrice, payload, payload['tax'], endDate, startDate, payload.quantity, spacePrice.pricing, offerPriceOfCategory);
            let cartInfo: any = []
            let totalSpaceCapacity: number = 0
            console.log("here to e")
            for (let i = 0; i < spacePrice.length; i++) {
                let basePrice = 0;
                switch (payload ?.bookingType) {
                    case ENUM.USER.BOOKING_TYPE.CUSTOM:
                        basePrice = calculatedPrice.bookingDuration.totalDays * spacePrice[i].pricing.daily 
                        break;
                    case ENUM.USER.BOOKING_TYPE.HOURLY:
                        basePrice = payload.totalHours * spacePrice[i].pricing.hourly
                        break;
                    case ENUM.USER.BOOKING_TYPE.MONTHLY:
                        basePrice = payload.totalMonths * spacePrice[i].pricing.monthly
                        break;
                }
                cartInfo.push({
                    spaceId: spacePrice[i]._id,
                    pricing: spacePrice[i].pricing,
                    basePrice:basePrice,
                    spaceLabel:spacePrice[i].spaceLabel,
                    position :spacePrice[i].position,
                    gridRow :spacePrice[i].gridRow,
                    gridColumn :spacePrice[i].gridColumn,
                    floorImage :spacePrice[i].floorImage
                })
                totalSpaceCapacity = totalSpaceCapacity + spacePrice[i].capacity
            }
            let dataToInsert = {
                deviceId: deviceId,
                quantity: payload.quantity,
                cartInfo: cartInfo,
                totalSpaceCapacity: totalSpaceCapacity, //payload.quantity * spacePrice.capacity,
                fromDate: moment(payload.fromDate).toISOString(),
                toDate: moment(payload.toDate).toISOString(),
                totalPayable: calculatedPrice.offerPrice ? calculatedPrice.totalPayable - calculatedPrice ?.offerPrice : calculatedPrice.totalPayable,
                shareUrl: propertyDetail.shareUrl,
                propertyData: {
                    propertyId: propertyDetail._id ? propertyDetail._id : "",
                    status: propertyDetail.status ? propertyDetail.status : "",
                    name: propertyDetail.name ? propertyDetail.name : "",
                    images: propertyDetail.images ? propertyDetail.images : "",
                    address: propertyDetail.address ? propertyDetail.address : "",
                    autoAcceptUpcomingBooking: propertyDetail.autoAcceptUpcomingBooking,
                    hostName: propertyDetail.userData.name,
                    hostImage: propertyDetail.userData.image,
                    hostEmail: propertyDetail.userData.email
                },
                hostId: propertyDetail.userData.userId,
                basePrice: calculatedPrice.totalPrice,
                bookingDuration: {
                    year: calculatedPrice ?.bookingDuration ?.year ? calculatedPrice.bookingDuration ?.year : 0,
                    months: calculatedPrice ?.bookingDuration ?.months ? calculatedPrice ?.bookingDuration ?.months : 0,
                    days: calculatedPrice ?.bookingDuration ?.days ? calculatedPrice ?.bookingDuration ?.days : 0,
                    totalDays: calculatedPrice ?.bookingDuration ?.totalDays ? calculatedPrice ?.bookingDuration ?.totalDays : 0,
                    totalHours: calculatedPrice ?.bookingDuration ?.totalHours ? calculatedPrice ?.bookingDuration ?.totalHours : 0
                },
                floorDescription: spacePrice[0].floorDescription,
                floorNumber: spacePrice[0].floorNumber,
                floorLabel: spacePrice[0].floorLabel,
                bookingType: payload ?.bookingType,
                taxes: calculatedPrice.taxes,
                taxPercentage: payload['tax'],
                offerPrice: calculatedPrice ?.offerPrice ? calculatedPrice ?.offerPrice : 0,
                offerLabelType: calculatedPrice ?.offerPricingObj ? calculatedPrice ?.offerPricingObj : {},
                category: spacePrice[0].category,
                subCategory: spacePrice[0].subCategory,
                adminCommissionAmount: payload?.adminCommissionAmount.commissionAmount,
            };
            let bookingData;
            if (checkDuplicateItems) {
               bookingData= await BookingCartV1.updateDocument(criteriaForDuplicateSpace,
                    dataToInsert,
                    { upsert: false , new:  true});
            }
            else bookingData = await new this.model(dataToInsert).save();
            let response: any = await this.spaceCartResponse(spacePrice, payload, calculatedPrice,bookingData, totalSpaceCapacity);
            return response;
        } catch (error) {
            console.error(`we have an error in guestBooking cart ==> ${error}`);
        }
    }

    /**
     * @method deprecated
     * @param propertyId 
     * @param spaceId 
     * @param startDate 
     * @param endDate 
     * @returns 
     */
    async fetchBookingSummary(propertyId: string, spaceId: string, startDate: any, endDate: any) {
        try {
            let pipeline: any = [];
            let matchCondition: any = {};
            matchCondition['propertyId'] = Types.ObjectId(propertyId);
            matchCondition['status'] = ENUM.PROPERTY.STATUS.ACTIVE;

            spaceId ? matchCondition['_id'] = Types.ObjectId(spaceId) : "";

            let pipelineMatchCondition: any = {
                "$expr": {
                    "$and": [
                        { "$eq": ["$spaceId", "$$spaceId"] },
                    ]
                }
            };
            pipeline.push(
                { '$match': matchCondition },
                {
                    "$lookup": {
                        "from": "booking_cart",
                        "let": {
                            "spaceId": "$_id"
                        },
                        "pipeline": [
                            {
                                "$match": pipelineMatchCondition
                            },
                            { $project: { quantity: 1, _id: 1, startDate: 1, endDate: 1, deviceId: 1, userId: 1, pricing: 1, taxes: { '$literal': 150 }, offerPrice: { '$literal': 1500 } } }
                        ],
                        "as": "cartInfo"
                    }
                },
                {
                    $group: {
                        _id: '$category._id',
                        data: {
                            $addToSet: {
                                category: '$category',
                                subCategory: '$subCategory',
                                space_Id: '$_id',
                                maxQuantity: '$units',
                                cartDetails: '$cartInfo'
                            }
                        }
                    }
                },
            )
            let response = await PropertySpaceV1.basicAggregate(pipeline);
            return response;
        } catch (error) {
            console.error(`we have an error in ${error}`);
        }
    }

    async saveOfflineCart(dataToInsert: any) {
        try {
            return await new this.model(dataToInsert).save();
        } catch (error) {
            console.error(`we have an error ==> ${error}`);
        }
    }

    async fetchOfferPrice(payload: any, spaceDetail: any): Promise<any> {
        try {
            const { propertyId, fromDate, toDate } = payload;
            let pipeline: any = [];
            let matchCondition: any = {};
            matchCondition['propertyId'] = Types.ObjectId(propertyId);
            matchCondition['status'] = ENUM.PROPERTY.STATUS.ACTIVE;

            payload.spaceId ? matchCondition['_id'] = Types.ObjectId(payload.spaceIds[0]) : "";

            let pipelineMatchCondition: any = {
                "$expr": {
                    "$and": [
                        { "$in": ["$$spaceId", "$spaceId"] },
                    ]
                }
            };
            if (fromDate && toDate) {
                pipelineMatchCondition['$expr']['$and'] =
                    [
                        { "$in": ["$$spaceId", "$spaceId"] },
                        { '$gte': [DATABASE.DATE_CONSTANTS.fromDate(fromDate, payload ?.offset), '$startDate'] },
                        { '$lte': [DATABASE.DATE_CONSTANTS.fromDate(fromDate, payload ?.offset), '$endDate'] }
                    ]
            }
            pipeline.push(
                { '$match': matchCondition },
                {
                    "$lookup": {
                        "from": "offers",
                        "let": {
                            "spaceId": "$_id"
                        },
                        "pipeline": [
                            {
                                "$match": pipelineMatchCondition
                            },
                            {
                                $project: {
                                    priceRange: 1,
                                    priceDetails: {
                                        $filter: {
                                            input: "$priceDetails",
                                            as: "elem",
                                            cond: { $ne: ["$$elem.discountPercentage", 0] }
                                        }
                                    }
                                }
                            }
                        ],
                        "as": "offerPricing"
                    }
                },
                {
                    $unwind: {
                        path: "$offerPricing"
                    }
                },
                { $project: { offerPricing: 1 } }
            )
            let response = await PropertySpaceV1.basicAggregate(pipeline);
            return response;
        } catch (error) {
            console.error(`we have an error fetching offer price ===> ${error}`);
        }
    }

    async addToEmployeeCart(payload: any, headers: any, next: any, userDetail: any, propertyDetail: any, spacePrice: any): Promise<any> {
        try {
            let deviceId = headers.devicedetails.deviceId;
            payload.deviceId = deviceId;

            let criteriaForDuplicateSpace = {
                "propertyData.propertyId": Types.ObjectId(payload.propertyId),
                "cartInfo.spaceId": { $in: payload.spaceIds }
            }

            let checkDuplicateItems = await BookingCartV1.findOne(criteriaForDuplicateSpace);
            let { endDate, startDate } = formattedTime({ fromDate: payload.fromDate, toDate: payload.toDate });
            endDate = moment(payload.toDate).add(payload.offset, "minute").toDate()
            startDate = moment(payload.fromDate).add(payload.offset, "minute").toDate()
            const calculatedPrice: any = await PayV1.calculateBookingDuration(endDate, startDate, payload);
            let cartInfo: any = []
            let totalSpaceCapacity: number = 0
            for (let i = 0; i < spacePrice.length; i++) {
                cartInfo.push({
                    spaceId: spacePrice[i]._id,
                    spaceLabel:spacePrice[i].spaceLabel,
                    position :spacePrice[i].position,
                    gridRow :spacePrice[i].gridRow,
                    gridColumn :spacePrice[i].gridColumn,
                    floorImage :spacePrice[i].floorImage
                })
                totalSpaceCapacity = totalSpaceCapacity + spacePrice[i].capacity
            }

            let dataToInsert = {
                deviceId: deviceId,
                quantity: payload.quantity,
                cartInfo:cartInfo,
                totalSpaceCapacity: totalSpaceCapacity,
                fromDate: moment(payload.fromDate).toISOString(),
                toDate: moment(payload.toDate).toISOString(),
                shareUrl: propertyDetail.shareUrl,
                userData: {
                    userId: userDetail._id,
                    status: userDetail.status,
                    name: userDetail.name,
                    image: userDetail.image ? userDetail ?.image : "",
                    phoneNo: userDetail.phoneNo,
                    countryCode: userDetail.countryCode,
                    createdAt: userDetail.createdAt,
                    email: userDetail.email,
                    profileStatus: userDetail.profileStatus,
                    bio: userDetail.bio,
                },
                propertyData: {
                    propertyId: propertyDetail._id ? propertyDetail._id : "",
                    status: propertyDetail.status ? propertyDetail.status : "",
                    name: propertyDetail.name ? propertyDetail.name : "",
                    images: propertyDetail.images ? propertyDetail.images : "",
                    address: propertyDetail.address ? propertyDetail.address : "",
                    autoAcceptUpcomingBooking: propertyDetail.autoAcceptUpcomingBooking,
                    hostName: propertyDetail.userData.name,
                    hostImage: propertyDetail.userData.image,
                    hostEmail: propertyDetail.userData.email
                },
                hostId: propertyDetail.userData.userId,
                bookingDuration: {
                    year: calculatedPrice ?.bookingDuration ?.year ? calculatedPrice.bookingDuration ?.year : 0,
                    months: calculatedPrice ?.bookingDuration ?.months ? calculatedPrice ?.bookingDuration ?.months : 0,
                    days: calculatedPrice ?.bookingDuration ?.days ? calculatedPrice ?.bookingDuration ?.days : 0,
                    totalDays: calculatedPrice ?.bookingDuration ?.totalDays ? calculatedPrice ?.bookingDuration ?.totalDays : 0,
                    totalHours: calculatedPrice ?.bookingDuration ?.totalHours ? calculatedPrice ?.bookingDuration ?.totalHours : 0
                },
                isEmployee: payload.isEmployee,
                floorDescription: spacePrice[0].floorDescription,
                floorNumber: spacePrice[0].floorNumber,
                floorLabel: spacePrice[0].floorLabel,
                bookingType: payload.bookingType,
                partnerId:Types.ObjectId( payload.partnerId),
                category: spacePrice[0].category,
                subCategory: spacePrice[0].subCategory,
                adminCommissionAmount: payload?.adminCommissionAmount?.commissionAmount,
            };
            let bookingData;
            if (checkDuplicateItems) {
                bookingData = await BookingCartV1.updateDocument(criteriaForDuplicateSpace,
                    dataToInsert,
                    { upsert: false , new: true});
            }
            else { bookingData = await new this.model(dataToInsert).save(); }
            let response: any = await this.spaceCartResponse(spacePrice, payload, calculatedPrice,bookingData, totalSpaceCapacity);
            return response;
        } catch (error) {
            console.error(`we have an error while addToEmployeeCart ===> ${error}`);
            next(error);
        }
    }

    async addToEmployeeProlongedCart(payload: any, headers: any, next: any, userDetail: any, propertyDetail: any, spacePrice: any): Promise<any> {
        try {
            let deviceId = headers.devicedetails.deviceId;
            payload.deviceId = deviceId;

            let criteriaForDuplicateSpace = {
                "propertyData.propertyId": Types.ObjectId(payload.propertyId),
                "cartInfo.spaceId": { $in: payload.spaceIds }
            }

            let checkDuplicateItems = await BookingCartV1.findOne(criteriaForDuplicateSpace);
            let { endDate, startDate } = formattedTime({ fromDate: payload.fromDate, toDate: payload.toDate });
            endDate = moment(payload.toDate).add(payload.offset, "minute").toDate()
            startDate = moment(payload.fromDate).add(payload.offset, "minute").toDate()
            const calculatedPrice: any = await PayV1.calculateBookingDuration(endDate, startDate, payload);
            
            let cartInfo: any = []
            let totalSpaceCapacity: number = 0
            console.log("here to e")
            for (let i = 0; i < spacePrice.length; i++) {

                cartInfo.push({
                    spaceId: spacePrice[i]._id
                })
                totalSpaceCapacity = totalSpaceCapacity + spacePrice[i].capacity
            }

            let dataToInsert = {
                deviceId: deviceId,
                quantity: payload.quantity,
                cartInfo:cartInfo,
                totalSpaceCapacity: totalSpaceCapacity,
                fromDate: moment(payload.fromDate).toISOString(),
                toDate: moment(payload.toDate).toISOString(),
                shareUrl: propertyDetail.shareUrl,
                userData: {
                    userId: userDetail._id,
                    status: userDetail.status,
                    name: userDetail.name,
                    image: userDetail.image ? userDetail ?.image : "",
                    phoneNo: userDetail.phoneNo,
                    countryCode: userDetail.countryCode,
                    createdAt: userDetail.createdAt,
                    email: userDetail.email,
                    profileStatus: userDetail.profileStatus
                },
                propertyData: {
                    propertyId: propertyDetail._id ? propertyDetail._id : "",
                    status: propertyDetail.status ? propertyDetail.status : "",
                    name: propertyDetail.name ? propertyDetail.name : "",
                    images: propertyDetail.images ? propertyDetail.images : "",
                    address: propertyDetail.address ? propertyDetail.address : "",
                    autoAcceptUpcomingBooking: propertyDetail.autoAcceptUpcomingBooking,
                    hostName: propertyDetail.userData.name,
                    hostImage: propertyDetail.userData.image,
                    hostEmail: propertyDetail.userData.email
                },
                hostId: propertyDetail.userData.userId,
                bookingDuration: {
                    year: calculatedPrice ?.bookingDuration ?.year ? calculatedPrice.bookingDuration ?.year : 0,
                    months: calculatedPrice ?.bookingDuration ?.months ? calculatedPrice ?.bookingDuration ?.months : 0,
                    days: calculatedPrice ?.bookingDuration ?.days ? calculatedPrice ?.bookingDuration ?.days : 0,
                    totalDays: calculatedPrice ?.bookingDuration ?.totalDays ? calculatedPrice ?.bookingDuration ?.totalDays : 0,
                    totalHours: calculatedPrice ?.bookingDuration ?.totalHours ? calculatedPrice ?.bookingDuration ?.totalHours : 0
                },
                isEmployee: payload.isEmployee,
                floorDescription: spacePrice[0].floorDescription,
                floorNumber: spacePrice[0].floorNumber,
                floorLabel: spacePrice[0].floorLabel,
                bookingType: payload.bookingType,
                partnerId: payload.partnerId,
                category: spacePrice[0].category,
                subCategory: spacePrice[0].subCategory,
                adminCommissionAmount: payload?.adminCommissionAmount.commissionAmount,
            };
            let bookingData;
            if (checkDuplicateItems) {
             bookingData=   await BookingCartV1.updateDocument(criteriaForDuplicateSpace,
                    dataToInsert,
                    { upsert: false });
            }
            else {  bookingData= await new this.model(dataToInsert).save(); }
            let response: any = await this.prolongSpaceCartResponse(spacePrice, payload, calculatedPrice,bookingData, totalSpaceCapacity);
            return response;
        } catch (error) {
            console.error(`we have an error while addToEmployeeCart ===> ${error}`);
            next(error);
        }
    }

    async fetchPropertyAndUserDetail(payload: any, res: any): Promise<any> {
        try {
            const userDetail: UserDetails = await UserV1.findOne({ _id: Types.ObjectId(payload?.userId) },
                {
                    _id: 1,
                    name: 1,
                    status: 1,
                    image: 1,
                    createdAt: 1,
                    phoneNo: 1,
                    email: 1,
                    countryCode: 1,
                    dob: 1,
                    profileStatus: 1,
                    bio: 1
                });

            const propertyDetail:PropertyDetails = await PropertyV1.findOne({ _id: Types.ObjectId(payload.propertyId) },
                {
                    propertyId: 1,
                    status: 1,
                    name: 1,
                    images: 1,
                    userId: 1,
                    address: 1,
                    autoAcceptUpcomingBooking: 1,
                    "userData.name": 1,
                    "userData.image": 1,
                    "userData.email": 1,
                    "userData.userId": 1,
                    "userData.dob": 1,
                    "shareUrl": 1,
                    "country.tax": 1,
                    "state.tax": 1
                })
            let spaceIds:any = [];
            let offerPriceOfCategory: any = []

            payload.spaceId.split(',').forEach((element: string) => {
                spaceIds.push(Types.ObjectId(element))
            });
            const spacePrice : Array<PropertySpaceDetails> = await PropertySpaceV1.findMany(
                { _id: { $in: spaceIds } },
                { isEmployee:1,category:1, subCategory:1, spaceLabel:1,pricing: 1, capacity: 1,position:1,gridRow :1,gridColumn :1,floorImage:1, units: 1, isOfferPrice: 1, floorDescription: 1, floorNumber: 1, floorLabel: 1 });

            payload.spaceIds = spaceIds
            console.log(spacePrice)
            if (spacePrice[0] ?.isOfferPrice == 1) {
                offerPriceOfCategory = await BookingCartV1.fetchOfferPrice(payload, spacePrice);
                console.log("offerPriceOfCategory",offerPriceOfCategory)
            }
            let commissionAmount:number;
           if(propertyDetail?.userData?.userId!==undefined) {
            commissionAmount = await HostV1.findOne({_id:propertyDetail?.userData?.userId},{commissionAmount:1}) 
            payload["adminCommissionAmount"]=commissionAmount;    
        }
            
            return {
                payload: payload,
                userDetail: payload.userId ? userDetail: {},
                propertyDetail: propertyDetail,
                spacePrice: spacePrice,
                offerPriceOfCategory: offerPriceOfCategory
            };
        } catch (error) {
            console.error(`we have an error while fetchPropertyAndUserDetail ===> ${error}`);
        }
    }

    async prolongSpaceCartResponse(spacePrice: any, payload: any, calculatedPrice:any,bookingData:any, totalSpaceCapacity?:any): Promise<any> {
        try {
            let cart = {
                quantity: bookingData?.quantity,
                _id: bookingData?._id, 
                startDate: bookingData?.startDate,
                endDate: bookingData?.endDate,
                deviceId: bookingData?.deviceId, 
                userId: bookingData?.userId,
                offerPrice: bookingData?.offerPrice,
                offerLabelType: bookingData?.offerLabelType,
                taxes: bookingData?.taxes,
                totalPayable: bookingData?.totalPayable,
                cartInfo: bookingData?.cartInfo,
                basePrice: bookingData?.basePrice, 
                pricing: bookingData?.pricing
               }
                let response = [{
                category: spacePrice[0].category,
                subCategory: spacePrice[0].subCategory,
                maxQuantity: spacePrice.length,
                cartDetails: cart,
                occupancy: totalSpaceCapacity,
                offerPrice: bookingData.offerPrice,
                taxPercentage: payload['tax'],
                bookingDuration: {
                    year: calculatedPrice?.bookingDuration ?.year,
                    months: calculatedPrice?.bookingDuration ?.months,
                    days: calculatedPrice?.bookingDuration ?.days,
                    totalDays: calculatedPrice?.bookingDuration ?.totalDays,
                    totalHours: calculatedPrice?.bookingDuration ?.totalHours
                },
                isEmployee: spacePrice[0]?.isEmployee,
                spaceAvailability: payload.availableUnits,
                floorDescription: spacePrice[0]?.floorDescription,
                floorNumber: spacePrice[0]?.floorNumber,
                floorLabel: spacePrice[0]?.floorLabel,
                partnerId: Types.ObjectId( payload?.partnerId)
            }]
            return response;
        } catch (error) {
            console.error(`we have an error in spaceCartResponse ==> ${error}`);
        }
    }
}

export const BookingCartV1 = new UserCartEntity(BookingCartModel);
