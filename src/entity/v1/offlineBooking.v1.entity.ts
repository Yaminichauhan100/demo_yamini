/**
 * @file admin.v1.entity
 * @description defines v1 admin entity methods
 * @author Desk Now Dev Team
*/

import { Model, Types } from "mongoose";
import BaseEntity from "../base.entity";
import OfflineUserModel from "@models/offline.user.model";
import { BookingCartV1, BookingV1 } from "@entity";
import { formattedTime, calculateCartPrice, generateUniqueId, Mailer, formatPrice } from "@services";
import { NextFunction } from "express";
import { ENUM, CONSTANT, FORMAT, CONFIG, WEB_PANELS, STORE_URL, } from "@common";
import moment from "moment";
import { TEMPLATER } from "../../htmlHelper";

class OfflineUserEntity extends BaseEntity {
    constructor(model: Model<any>) {
        super(model);
    }
    async addOfflineUser(payload: any) {
        try {
            return await new this.model(payload).save();
        } catch (error) {
            console.error(`we have an error ==> ${error}`);
        }
    }

    async updateOfflineUser(payload: any, offlineUserId: string) {
        try {
            let dataToUpdate = {
                name: payload ?.name ? payload ?.name : "",
                "email": payload ?.email ? payload ?.email : "",
                "fullMobileNumber": payload ?.fullMobileNumber ? payload ?.fullMobileNumber : "",
                "companyName": payload ?.companyName ? payload ?.companyName : "",
                "companyEmail": payload ?.companyEmail ? payload ?.companyEmail : "",
                "companyOfficeNumber": payload ?.companyOfficeNumber ? payload ?.companyOfficeNumber : "",
                "houseNumber": payload ?.houseNumber ? payload ?.houseNumber : "",
                "street": payload ?.street ? payload ?.street : "",
                "landmark": payload ?.landmark ? payload ?.landmark : "",
                "country": payload ?.country ? payload ?.country : "",
                "zipCode": payload ?.zipCode ? payload ?.zipCode : "",
                "state": payload ?.state ? payload ?.state : "",
                "city": payload ?.city ? payload ?.city : "",
                "registrationNumber": payload ?.registrationNumber ? payload ?.registrationNumber : ""
            }
            return await this.updateDocument({ _id: Types.ObjectId(payload.userId) }, dataToUpdate, { new: true });
        } catch (error) {
            console.error(`we have an error ==> ${error}`);
            return Promise.reject(error);
        }
    }

    async addSpaceToCart(payload: any, headers: any, next: NextFunction, userDetail: any, propertyDetail: any, spacePrice: any) {
        try {
            let calculatedPrice: any

            let deviceId = headers.devicedetails.deviceId;
            payload.deviceId = deviceId;

            let criteriaForDuplicateSpace = {
                "propertyData.propertyId": Types.ObjectId(payload.propertyId),
                'cartInfo.spaceId': { $in: payload.spaceIds }
            }

            let checkDuplicateItems = await BookingCartV1.findOne(criteriaForDuplicateSpace);
            const { endDate, startDate } = formattedTime({ fromDate: payload.fromDate, toDate: payload.toDate });
            switch (payload ?.bookingType) {
                case ENUM.USER.BOOKING_TYPE.CUSTOM:
                    calculatedPrice = await calculateCartPrice(0, endDate, startDate, payload.quantity, spacePrice.pricing, spacePrice.pricing.offerPricingArray);
                    break;
                case ENUM.USER.BOOKING_TYPE.HOURLY:
                    calculatedPrice = await BookingCartV1.calculateHourlyCartPrice(payload, endDate, startDate, spacePrice, []);
                    break
                case ENUM.USER.BOOKING_TYPE.MONTHLY:
                    calculatedPrice = await BookingCartV1.calculateMonthlyCartPrice(payload, endDate, startDate, spacePrice, []);
                    break
            }

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
                    spaceId: spacePrice[i]._id,
                    pricing: spacePrice[i].pricing,
                    basePrice: basePrice,
                    spaceLabel: spacePrice[i].spaceLabel,
                    position :spacePrice[i].position,
                    gridRow :spacePrice[i].gridRow,
                    gridColumn :spacePrice[i].gridColumn,
                    floorImage :spacePrice[i].floorImage
                })
                totalSpaceCapacity = totalSpaceCapacity + spacePrice[i].capacity
            }

            let dataToInsert = {
                deviceId: deviceId ? deviceId : "",
                quantity: payload.quantity,
                spaceId: payload.spaceId,
                totalSpaceCapacity: totalSpaceCapacity,
                fromDate: moment(payload.fromDate).toISOString(),
                toDate: moment(payload.toDate).toISOString(),
                cartInfo: cartInfo,
                totalPayable: payload.price,
                adminCommissionAmount: payload.commissionAmount,
                userData: {
                    userId: userDetail._id,
                    status: userDetail.status ? userDetail.status : "",
                    name: userDetail.name,
                    image: userDetail.image ? userDetail ?.image : "",
                    phoneNo: userDetail.fullMobileNumber ? userDetail.fullMobileNumber : "",
                    countryCode: userDetail.countryCode ? userDetail.countryCode : "",
                    createdAt: userDetail.createdAt,
                    email: userDetail.email ? userDetail.email : ""
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
                hostId: propertyDetail.userId,
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
                subCategory: spacePrice[0].subCategory
            };
            let bookingData
            if (checkDuplicateItems) {
                bookingData = await BookingCartV1.updateDocument(criteriaForDuplicateSpace,
                    dataToInsert,
                    { upsert: false, new : true }, );
            }
            else { bookingData = await BookingCartV1.saveOfflineCart(dataToInsert); }
            let response: any = await BookingCartV1.spaceCartResponse(spacePrice, payload, calculatedPrice, bookingData, totalSpaceCapacity);
            return response;
        } catch (error) {
            console.error(`we have an error ==> ${error}`);
        }
    }

    async userBookSpace(cartData: any, headers: any, offset: number) {
        try {
            let deviceId = headers.devicedetails.deviceId;
            let dataToInsert = {
                bookingStatus: ENUM.BOOKING.STATUS.ACCEPTED,
                cartId: cartData._id,
                deviceId: deviceId,
                quantity: cartData.quantity,
                cartInfo: cartData.cartInfo,
                fromDate: cartData.fromDate,
                toDate: cartData.toDate,
                occupancy: cartData.occupancy * cartData.quantity,
                bookingId: generateUniqueId('DSK'),
                userData: {
                    userId: cartData.userData.userId,
                    status: cartData.userData.status,
                    name: cartData.userData.name,
                    image: cartData.userData.image,
                    phoneNo: cartData.userData.phoneNo,
                    countryCode: cartData.userData.countryCode,
                    createdAt: cartData.userData.createdAt,
                    email: cartData.userData.email
                },
                propertyData: {
                    propertyId: cartData.propertyData.propertyId,
                    status: cartData.propertyData.status,
                    name: cartData.propertyData.name,
                    images: cartData.propertyData.images,
                    address: cartData.propertyData.address,
                    hostName: cartData.propertyData.hostName,
                    autoAcceptUpcomingBooking: cartData.propertyData.autoAcceptUpcomingBooking,
                    hostImage: cartData.propertyData.hostImage,
                    hostEmail: cartData.propertyData.hostEmail
                },
                bookingMode: ENUM.BOOKING_TYPE.TYPE.OFFLINE,
                hostId: cartData.hostId,
                totalPayable: cartData.totalPayable,
                pricing: cartData.pricing,
                totalSpaceCapacity: cartData.totalSpaceCapacity,
                basePrice: cartData.basePrice,
                bookingDuration: {
                    year: cartData ?.bookingDuration ?.year ? cartData.bookingDuration ?.year : 0,
                    months: cartData ?.bookingDuration ?.months ? cartData ?.bookingDuration ?.months : 0,
                    days: cartData ?.bookingDuration ?.days ? cartData ?.bookingDuration ?.days : 0,
                    totalDays: cartData ?.bookingDuration ?.totalDays ? cartData ?.bookingDuration ?.totalDays : 0,
                    totalHours: cartData ?.bookingDuration ?.totalHours ? cartData ?.bookingDuration ?.totalHours : 0
                },
                category: cartData.category,
                subCategory: cartData.subCategory,
                floorDescription: cartData.floorDescription,
                floorNumber: cartData.floorNumber,
                partnerId: cartData.partnerId,
                isEmployee: cartData.isEmployee,
                floorLabel: cartData.floorLabel,
                bookingType: cartData.bookingType
            }
            let response: any = await BookingV1.createOne(dataToInsert);
            response.taxes = 0
            let bookingHtml = await TEMPLATER.makeHtmlTemplate(process.cwd() + "/src/views/offline_booking/offline_booking_emailer.html", {
                logo: CONSTANT.VERIFY_EMAIL_LOGO,
                facebookLogo: CONSTANT.FACEBOOK_LOGO_PNG,
                mockpur: CONSTANT.MOCKUPER_6,
                appStore: CONSTANT.APP_STORE_BADGE,
                googlePlay: CONSTANT.GOOGLE_PLAY_BADGE,
                igLogo: CONSTANT.INSTAGRAM_LOGO,
                twitterLogo: CONSTANT.TWITTER_LOGO_NEW,
                linkedinLogo: CONSTANT.LINKEDIN_LOGO,
                curratedLogo: CONSTANT.COMPLEMENTRAY_2,
                complementaryLogo: CONSTANT.PEXELS_DARIA,
                printingLogo: CONSTANT.PEXELS_COTTONBRO,
                healthierLogo: CONSTANT.PEXELS_PEW,
                userName: response.userData.name,
                propertyName: `${response.propertyData.name}`,
                propertyAddress: `${response.propertyData.address}`,
                propertyImage: `${response.propertyData ?.images[0]}`,
                hostEmail: `${response ?.propertyData ?.hostEmail}`,
                hostName: `${response ?.propertyData ?.hostName}`,
                addressPin: CONSTANT.ADDRESS_PIN,
                fromDate: moment(response.fromDate).format('MMM DD,YYYY'),
                toDate: moment(response.toDate).format('MMM DD,YYYY'),
                bookingId: response.bookingId,
                subCategoryName: response.subCategory.name,
                quantity: response.quantity,
                totalPayable: formatPrice(response.totalPayable),
                paymentPlan: response ?.paymentPlan != ENUM.PAYMENT.PLAN.COMPLETE ? 'Monthly' : 'Complete',
                bookingStatus: 'Successfully',
                taxes: formatPrice(response ?.taxes),
                webPanelUrl: CONFIG.NODE_ENV === 'stag' ? WEB_PANELS.USER_PANEL_STAGING : WEB_PANELS.USER_PANEL_PROD,
                contactUsUrl: CONFIG.NODE_ENV === 'stag' ? WEB_PANELS.CONTACT_US_STAGING : WEB_PANELS.CONTACT_US_PROD,
                FAQUrl: CONFIG.NODE_ENV === 'stag' ? WEB_PANELS.FAQ_STAGING : WEB_PANELS.FAQ_PROD,
                contactUrl: CONFIG.NODE_ENV === 'stag' ? `https://desknowuserstg.appskeeper.com/chat?userId=${response.hostId}` : `${WEB_PANELS.USER_PANEL_PROD}/chat?userId=${response.hostId}`,
                cancelBookingUrl: CONFIG.NODE_ENV === 'stag' ? `https://desknowuserstg.appskeeper.com/profile/booking/detail/${response._id}` : `${WEB_PANELS.USER_PANEL_PROD}/profile/booking/detail/${response._id}`,
                tAndCUrl: CONFIG.NODE_ENV === 'stag' ? `https://desknowuserstg.appskeeper.com/content/term-condition` : `${WEB_PANELS.USER_PANEL_PROD}/content/term-condition`,
                appStoreLink : STORE_URL.APPSTORE_USER,
                playStoreLink : STORE_URL.PLAYSOTE_USER
            });
            await Promise.all([
                BookingCartV1.remove({ _id: cartData._id }),
                BookingV1.updateCalendarSchedule(dataToInsert, response ?._id),
                Mailer.sendMail(FORMAT.EMAIL.USER.BOOKING_EMAIL(`${response.userData.email}`, bookingHtml))
            ])
            return response;
        } catch (error) {
            console.error(`we have an error ==> ${error}`);
            return Promise.reject(error);
        }
    }

    async userUpdateOfflineBooking(bookingData: any, payload: any) {
        try {
            let dataToUpdate = {
                bookingStatus: ENUM.BOOKING.STATUS.ACCEPTED,
                quantity: bookingData.quantity,
                spaceId: bookingData.spaceId,
                fromDate: bookingData.fromDate,
                toDate: bookingData.toDate,
                occupancy: payload.occupancy ? payload.occupancy * bookingData.quantity : payload.occupancy,
                userData: {
                    userId: bookingData.userData.userId,
                    status: bookingData.userData.status,
                    name: bookingData.userData.name,
                    image: bookingData.userData.image,
                    phoneNo: bookingData.userData.phoneNo,
                    countryCode: bookingData.userData.countryCode,
                    createdAt: bookingData.userData.createdAt,
                    email: bookingData.userData.email
                },
                propertyData: {
                    propertyId: bookingData.propertyData.propertyId,
                    status: bookingData.propertyData.status,
                    name: bookingData.propertyData.name,
                    images: bookingData.propertyData.images,
                    address: bookingData.propertyData.address,
                    hostName: bookingData.propertyData.hostName,
                    autoAcceptUpcomingBooking: bookingData.propertyData.autoAcceptUpcomingBooking,
                    hostImage: bookingData.propertyData.hostImage,
                    hostEmail: bookingData.propertyData.hostEmail
                },
                bookingMode: 1,
                hostId: bookingData.hostId,
                totalPayable: bookingData.totalPayable,
                totalSpaceCapacity: bookingData.totalSpaceCapacity,
                bookingDuration: {
                    year: bookingData ?.bookingDuration ?.year ? bookingData.bookingDuration ?.year : 0,
                    months: bookingData ?.bookingDuration ?.months ? bookingData ?.bookingDuration ?.months : 0,
                    days: bookingData ?.bookingDuration ?.days ? bookingData ?.bookingDuration ?.days : 0,
                    totalDays: bookingData ?.bookingDuration ?.totalDays ? bookingData ?.bookingDuration ?.totalDays : 0,
                    totalHours: bookingData ?.bookingDuration ?.totalHours ? bookingData ?.bookingDuration ?.totalHours : 0
                },
                category: bookingData.category,
                subCategory: bookingData.subCategory,
                floorDescription: bookingData.floorDescription,
                floorNumber: bookingData.floorNumber,
                partnerId: bookingData ?.partnerId,
                isEmployee: bookingData.isEmployee,
                floorLabel: bookingData.floorLabel,
                bookingType: bookingData.bookingType
            }
            let response: any = await BookingV1.updateDocument({ _id: Types.ObjectId(payload.bookingId) }, dataToUpdate)

            //updating calendar data
            Promise.all([
                BookingCartV1.remove({ _id: bookingData._id }),
                BookingV1.updateCalendarSchedule(dataToUpdate, response ?._id, true)
            ])
            return response;
        } catch (error) {
            console.error(`we have an error ==> ${error}`);
            return Promise.reject(error);
        }
    }

}

export const OfflineUserV1 = new OfflineUserEntity(OfflineUserModel);