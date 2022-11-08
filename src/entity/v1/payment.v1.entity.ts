/**
 * @file admin.v1.entity
 * @description defines v1 admin entity methods
 * @author Desk Now Dev Team
*/

import { Model, Types } from "mongoose";
import { generateUniqueId, PushNotification, Mailer, GeneratePdf, redisDOA, formatPrice, emailService, calculateDiffInSeconds, GoogleCalendar } from "@services";
import BaseEntity from "../base.entity";
import paymentModel from "@models/payment.model";
import userModel from "@models/user.model";
import hostModel from "@models/host.model";
import paymentLogs from "@models/payment_logs.model";
import { UserV1 } from "./user.v1.entity";
import { BookingV1 } from "./booking.v1.entity";
import { ENUM, CONSTANT, FORMAT, CONFIG, WEB_PANELS } from "@common";
import moment = require("moment");
import { CoworkerV1, HostV1, PropertyV1, RecurringPayV1 } from "@entity";
import { TEMPLATER } from "../../htmlHelper";
import { CommonController, PaymentController } from "@controllers";
import { Request } from "express";

class PaymentEntity extends BaseEntity {

    async updateEmployeeBookingPayDetails(objectToSave: any): Promise<any> {
        try {
            return await new this.model(objectToSave).save();
        } catch (error) {
            console.error(`we have an error while updateEmployeePayDetails ==> ${error}`);
        }
    }
    /**
     * @description method to update recurring plan in recurring model for partial payment
     * @param booking booking complete object
     */
    async updateRecurringPlan(booking: any): Promise<any> {
        try {
            await RecurringPayV1.removeAll({ bookingId: Types.ObjectId(booking._id) });
            let month = booking.fromDate.getMonth();
            let recurringData: any = [];
            for (let m = moment(booking ?.fromDate); m.isBefore(booking ?.toDate); m.add(30, 'days')) {
                let recurringMonthlyData = {
                    month: month,
                    bookingId: booking._id,
                    fromDate: booking.fromDate,
                    toDate: booking.toDate,
                    paymentDate: m.format(),
                    paymentStatus: ENUM.PAYMENT.STATUS.PENDING,
                    paymentPlan: ENUM.PAYMENT.PLAN.MONTHLY,
                    monthlyPayable: booking.monthlyPayable
                }
                recurringData.push(recurringMonthlyData);
                month++;
            }
            await RecurringPayV1.insertMany(recurringData);
        } catch (error) {
            console.error(`we have an error ==> ${error}`);
        }
    }

    async updatePromotionStatus(promotionDetail: any): Promise<any> {
        try {
            const expireTime = calculateDiffInSeconds(promotionDetail ?.fromDate, true);
            await redisDOA.setKey(`${ENUM.PROPERTY.PROMOTION_FLAG.START}_${promotionDetail ?._id}`, promotionDetail ?.fromDate);
            await redisDOA.expireKey(`${ENUM.PROPERTY.PROMOTION_FLAG.START}_${promotionDetail ?._id}`, expireTime);
        } catch (error) {
            console.error(`we got an error while updating promotion status =======> ${error}`);
        }
    }

    constructor(model: Model<any>) {
        super(model);
    }

    async getUserDetails(payload: any) {
        try {
            let userData = await userModel.findOne({ _id: Types.ObjectId(payload) });
            return userData;
        } catch (error) {
            console.error(">>>>>>>>>>>>", error);
            return Promise.reject(error)
        }
    }
    /**
     * @description method to update recurring model booking status
     * @param booking booking model complete object
     */
    async updateRecurringModel(booking: any) {
        try {
            await RecurringPayV1.removeAll({ bookingId: Types.ObjectId(booking._id) });
            let month = booking.fromDate.getMonth();
            let recurringData: any = [];
            // !!loop to add 1 month each and subtract 1 month from toDate
            for (let date = moment(booking.fromDate); date.isBefore(moment(booking.toDate).subtract(1, 'month')); date.add(1, 'months')) {
                let recurringMonthlyData = {
                    month: month,
                    bookingId: booking._id,
                    fromDate: booking.fromDate,
                    toDate: booking.toDate,
                    paymentDate: date.format(),
                    paymentStatus: date.format() == moment(booking.fromDate).format() ?
                        ENUM.PAYMENT.STATUS.SUCCESS :
                        ENUM.PAYMENT.STATUS.PENDING,
                    paymentPlan: ENUM.PAYMENT.PLAN.MONTHLY,
                    monthlyPayable: booking.giftCardAmount ? ((booking.totalPayable - booking.giftCardAmount) / booking ?.bookingDuration ?.months) : booking.monthlyPayable
                }
                recurringData.push(recurringMonthlyData);
                month++;
            }
            await RecurringPayV1.insertMany(recurringData);
        } catch (error) {
            console.error(`we have an error ==> ${error}`);
        }
    }
    async getHostDetails(payload: any) {
        try {
            let userData = await hostModel.findOne({ _id: Types.ObjectId(payload) });
            return userData;
        } catch (error) {
            console.error(">>>>>>>>>>>>", error);
            return Promise.reject(error)
        }
    }

    async insertPaymentLogs(userId: any, data: any, status: any): Promise<IPayment.PaymentLogs> {
        try {
            let objectToSave = {
                userId: userId,
                data: data,
                status: status
            }
            let result = new paymentLogs(objectToSave).save();

            return result;
        } catch (error) {
            console.error(">>>>>>>>>>>>2222", error);
            return Promise.reject(error);
        }
    }


    async updateBooking(payload: any, paymentIntent: any, checkAutoAccept: any, req: Request) {
        try {
            let bookingDetails: any;
            let checkAutoAccept: any = await BookingV1.findOne({ _id: Types.ObjectId(payload.bookingId) })


            let commission: any = await HostV1.findOne({ _id: Types.ObjectId(checkAutoAccept.hostId) }, { commissionAmount: 1 })
            let adminCommission: number = (checkAutoAccept.totalPayable * commission.commissionAmount) / 100

            let objectToSave = {
                stripeTransactionId: paymentIntent.id,
                price: checkAutoAccept.totalPayable,
                bookingId: payload.bookingId,
                status: ENUM.PAYMENT.STATUS.SUCCESS,
                propertyId: checkAutoAccept.propertyData.propertyId,
                userId: payload.userId,
                paymentPlan: payload.paymentPlan,
                userType: ENUM.USER.TYPE.USER,
                hostId: checkAutoAccept.hostId,
                last4: payload.cardDigit,
                transactionId: generateUniqueId('DSKTR'),
                payoutPrice:checkAutoAccept.totalPayable-adminCommission,
                adminCommissionAmount:adminCommission
            }

            let [hostToken, userToken] = await Promise.all([
                HostV1.fetchHostDeviceToken(checkAutoAccept.hostId),
                UserV1.fetchUserDeviceToken(payload.userId)
            ])


            let result = await new this.model(objectToSave).save();

            if (checkAutoAccept.propertyData.autoAcceptUpcomingBooking == true) {
                bookingDetails = await Promise.all([
                    BookingV1.updateDocument({
                        _id: Types.ObjectId(payload.bookingId),
                        "propertyData.autoAcceptUpcomingBooking": true
                    }, {
                        paymentStatus: ENUM.PAYMENT.STATUS.SUCCESS,
                        bookingStatus: ENUM.BOOKING.STATUS.ACCEPTED,
                        transactionId: result.transactionId,
                        transactionType: result.paymentPlan,
                        paymentMode: result.paymentMethod,
                        transactionDate: result.createdAt,
                        acceptedOn: moment(),
                        last4: payload.cardDigit,
                        paymentPlan: payload.paymentPlan,
                        adminCommission : adminCommission
                    }, { new: true }),
                ]);

                let pricePerUnit = (bookingDetails[0].basePrice).toFixed(2) / bookingDetails[0].quantity
                let hostHtml = await TEMPLATER.makeHtmlTemplate(process.cwd() + "/src/views/Online_Booking/host_booking_emailer.html", {
                    logo: CONSTANT.VERIFY_EMAIL_LOGO,
                    propertyName: `${bookingDetails[0].propertyData.name}`,
                    propertyAddress: `${bookingDetails[0].propertyData.address}`,
                    propertyImage: `${bookingDetails[0].propertyData ?.images[0]}`,
                    fromDate: moment(bookingDetails[0].fromDate).format('MMM DD,YYYY'),
                    toDate: moment(bookingDetails[0].toDate).format('MMM DD,YYYY'),
                    bookingId: bookingDetails[0].bookingId,
                    subCategoryName: bookingDetails[0].subCategory.name,
                    basePrice: formatPrice(bookingDetails[0].basePrice),
                    offerPrice: formatPrice(bookingDetails[0].offerPrice),
                    priceBeforeTaxes: formatPrice(bookingDetails[0].basePrice),
                    totalPayable: formatPrice(bookingDetails[0].totalPayable),
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
                    status: "confirmed",
                    healthierLogo: CONSTANT.PEXELS_PEW,
                    webPanelUrl: CONFIG.NODE_ENV === 'stag' ? WEB_PANELS.HOST_PANEL_STAGING : WEB_PANELS.HOST_PANEL_PROD,
                    CONTACT_US: CONFIG.NODE_ENV === 'stag' ? WEB_PANELS.CONTACT_US_HOST_STAGING : WEB_PANELS.CONTACT_US_PAM_PROD,
                    FAQUrl: CONFIG.NODE_ENV === 'stag' ? WEB_PANELS.FAQ_HOST_STAGING : WEB_PANELS.FAQ_PAM_PROD,
                    cancelBookingUrl: CONFIG.NODE_ENV === 'stag' ? `https://desknowhoststg.appskeeper.com/host/booking/booking-details/${payload.bookingId}` : `${WEB_PANELS.HOST_PANEL_PROD}/host/booking/booking-details/${payload.bookingId}`,
                    tAndCUrl: CONFIG.NODE_ENV === 'stag' ? `https://desknowhoststg.appskeeper.com/content/term-condition` : `${WEB_PANELS.HOST_PANEL_PROD}/content/term-condition`,

                    calendarIndexUrl: CONFIG.NODE_ENV === 'stag' ?
                        `https://desknowhoststg.appskeeper.com/host/outlook-access?bookingId=${payload.bookingId}&userType=${ENUM.USER.TYPE.HOST}` :
                        `${WEB_PANELS.USER_PANEL_PROD}/host/outlook-access?bookingId=${payload.bookingId}&userType=${ENUM.USER.TYPE.HOST}`,

                    calendarIndexGmailUrl: CONFIG.NODE_ENV === 'stag' ?
                        `https://desknowhoststg.appskeeper.com/host/gmail-access?bookingId=${payload.bookingId}&userType=${ENUM.USER.TYPE.HOST}` :
                        `${WEB_PANELS.HOST_PANEL_PROD}/host/gmail-access?bookingId=${payload.bookingId}&userType=${ENUM.USER.TYPE.HOST}`
                });

                let bookingHtml = await TEMPLATER.makeHtmlTemplate(process.cwd() + "/src/views/Online_Booking/booking-confirmation.html", {
                    logo: CONSTANT.VERIFY_EMAIL_LOGO,
                    status: "confirmed",
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
                    userName: bookingDetails[0].userData.name,
                    propertyName: `${bookingDetails[0].propertyData.name}`,
                    propertyAddress: `${bookingDetails[0].propertyData.address}`,
                    propertyImage: `${bookingDetails[0].propertyData ?.images[0]}`,
                    hostEmail: `${bookingDetails[0] ?.propertyData ?.hostEmail}`,
                    hostName: `${bookingDetails[0] ?.propertyData ?.hostName}`,
                    addressPin: CONSTANT.ADDRESS_PIN,
                    fromDate: moment(bookingDetails[0].fromDate).format('MMM DD,YYYY'),
                    toDate: moment(bookingDetails[0].toDate).format('MMM DD,YYYY'),
                    bookingId: bookingDetails[0].bookingId,
                    subCategoryName: bookingDetails[0].subCategory.name,
                    quantity: bookingDetails[0].quantity,
                    totalPayable: formatPrice(bookingDetails[0].totalPayable),
                    paymentPlan: bookingDetails[0] ?.paymentPlan != ENUM.PAYMENT.PLAN.COMPLETE ? 'Monthly' : 'Complete',
                    bookingStatus: 'Successfully',
                    price: formatPrice(bookingDetails[0].basePrice),
                    taxPercentage: bookingDetails[0].taxPercentage,
                    taxes: formatPrice(bookingDetails[0].taxes),
                    pricePerUnit: formatPrice(pricePerUnit),
                    webPanelUrl: CONFIG.NODE_ENV === 'stag' ? WEB_PANELS.USER_PANEL_STAGING : WEB_PANELS.USER_PANEL_PROD,
                    contactUsUrl: CONFIG.NODE_ENV === 'stag' ? WEB_PANELS.CONTACT_US_STAGING : WEB_PANELS.CONTACT_US_PROD,
                    FAQUrl: CONFIG.NODE_ENV === 'stag' ? WEB_PANELS.FAQ_STAGING : WEB_PANELS.FAQ_PROD,
                    contactUrl: CONFIG.NODE_ENV === 'stag' ? `https://desknowuserstg.appskeeper.com/chat?userId=${bookingDetails[0].hostId}` : `${WEB_PANELS.USER_PANEL_PROD}/chat?userId=${bookingDetails[0].hostId}`,
                    cancelBookingUrl: CONFIG.NODE_ENV === 'stag' ? `https://desknowuserstg.appskeeper.com/profile/booking/detail/${payload.bookingId}` : `${WEB_PANELS.USER_PANEL_PROD}/profile/booking/detail/${payload.bookingId}`,
                    tAndCUrl: CONFIG.NODE_ENV === 'stag' ? `https://desknowuserstg.appskeeper.com/content/term-condition` : `${WEB_PANELS.USER_PANEL_PROD}/content/term-condition`,

                    calendarIndexUrl: CONFIG.NODE_ENV === 'stag' ?
                        `https://desknowuserstg.appskeeper.com/user/outlook-access?bookingId=${payload.bookingId}&userType=${ENUM.USER.TYPE.USER}` :
                        `${WEB_PANELS.USER_PANEL_PROD}/user/outlook-access?bookingId=${payload.bookingId}&userType=${ENUM.USER.TYPE.USER}`,

                    calendarIndexGmailUrl: CONFIG.NODE_ENV === 'stag' ?
                        `https://desknowuserstg.appskeeper.com/user/gmail-access?bookingId=${payload.bookingId}&userType=${ENUM.USER.TYPE.USER}` :
                        `${WEB_PANELS.USER_PANEL_PROD}/user/gmail-access?bookingId=${payload.bookingId}&userType=${ENUM.USER.TYPE.USER}`
                });

                await Promise.all([
                    this.createCalendarEvents(bookingDetails[0] ?.userData.userId, bookingDetails[0] ?.hostId, bookingDetails[0], req),
                    PushNotification.bookingSuccessfulHost(hostToken, bookingDetails[0]),
                    PushNotification.sendUserBookingSuccessPushNotification(userToken, bookingDetails[0]),
                    PropertyV1.updateOne({ _id: Types.ObjectId(bookingDetails[0] ?.propertyData ?.propertyId) },
                        {
                            $inc: {
                                totalBookingsCount: 1,
                                averageDuration: bookingDetails[0] ?.bookingDuration ?.totalDays,
                                unitsBooked: bookingDetails[0] ?.quantity
                            }
                        }),
                    RecurringPayV1.update(
                        { bookingId: Types.ObjectId(bookingDetails[0]._id) },
                        { bookingStatus: ENUM.BOOKING.STATUS.ACCEPTED },
                        { multi: true }
                    ),
                    Mailer.sendMail(FORMAT.EMAIL.USER.BOOKING_EMAIL_CONFIRMATION_HOST(`${bookingDetails[0].propertyData.hostEmail}`, hostHtml, bookingDetails[0].propertyData.name)),
                    Mailer.sendMail(FORMAT.EMAIL.USER.BOOKING_EMAIL_CONFIRMATION_USER(`${bookingDetails[0].userData.email}`, bookingHtml, bookingDetails[0].propertyData.name, "confirmed")),
                    RecurringPayV1.update(
                        { bookingId: Types.ObjectId(bookingDetails[0]._id) },
                        { bookingStatus: ENUM.BOOKING.STATUS.ACCEPTED },
                        { multi: true }
                    ),
                    CoworkerV1.updateOne({
                        bookingId: bookingDetails[0] ?._id,
                        userId: bookingDetails[0] ?.userData.userId
                    }, {
                        name: bookingDetails[0] ?.userData.name,
                        email: bookingDetails[0] ?.userData.email,
                        status: 1,
                        image: bookingDetails[0] ?.userData.image,
                        ownerDetail: bookingDetails[0] ?.userData,
                        userId: bookingDetails[0] ?.userData.userId,
                        isOwner: 1,
                        bookingId: bookingDetails[0] ?._id,
                        bookingNumber: bookingDetails[0] ?.bookingId,
                        propertyId: bookingDetails[0] ?.propertyData.propertyId,
                        hostId: bookingDetails[0] ?.hostId,
                    }, { upsert: true })
                ])
                await GeneratePdf.invoice(payload.bookingId);
            } else {
                bookingDetails = await Promise.all([
                    BookingV1.updateDocument({
                        _id: Types.ObjectId(payload.bookingId),
                        "propertyData.autoAcceptUpcomingBooking": false
                    }, {
                        paymentStatus: ENUM.PAYMENT.STATUS.SUCCESS,
                        bookingStatus: ENUM.BOOKING.STATUS.PENDING,
                        transactionId: result.transactionId,
                        transactionType: result.paymentPlan,
                        paymentMode: result.paymentMethod,
                        transactionDate: result.createdAt,
                        paymentPlan: payload.paymentPlan,
                        adminCommission : adminCommission
                    })
                ])

                let hostHtml = await TEMPLATER.makeHtmlTemplate(process.cwd() + "/src/views/Online_Booking/host_booking_emailer.html", {
                    logo: CONSTANT.VERIFY_EMAIL_LOGO,
                    propertyName: `${bookingDetails[0].propertyData.name}`,
                    propertyAddress: `${bookingDetails[0].propertyData.address}`,
                    propertyImage: `${bookingDetails[0].propertyData ?.images[0]}`,
                    fromDate: moment(bookingDetails[0].fromDate).format('MMM DD,YYYY'),
                    toDate: moment(bookingDetails[0].toDate).format('MMM DD,YYYY'),
                    bookingId: bookingDetails[0].bookingId,
                    subCategoryName: bookingDetails[0].subCategory.name,
                    basePrice: formatPrice(bookingDetails[0].basePrice),
                    offerPrice: formatPrice(bookingDetails[0].offerPrice),
                    priceBeforeTaxes: formatPrice(bookingDetails[0].basePrice),
                    totalPayable: formatPrice(bookingDetails[0].totalPayable),
                    facebookLogo: CONSTANT.FACEBOOK_LOGO_PNG,
                    mockpur: CONSTANT.MOCKUPER_6,
                    status: "pending",
                    appStore: CONSTANT.APP_STORE_BADGE,
                    googlePlay: CONSTANT.GOOGLE_PLAY_BADGE,
                    igLogo: CONSTANT.INSTAGRAM_LOGO,
                    twitterLogo: CONSTANT.TWITTER_LOGO_NEW,
                    linkedinLogo: CONSTANT.LINKEDIN_LOGO,
                    curratedLogo: CONSTANT.COMPLEMENTRAY_2,
                    complementaryLogo: CONSTANT.PEXELS_DARIA,
                    printingLogo: CONSTANT.PEXELS_COTTONBRO,
                    healthierLogo: CONSTANT.PEXELS_PEW,
                    webPanelUrl: CONFIG.NODE_ENV === 'stag' ? WEB_PANELS.HOST_PANEL_STAGING : WEB_PANELS.HOST_PANEL_PROD,
                    CONTACT_US: CONFIG.NODE_ENV === 'stag' ? WEB_PANELS.CONTACT_US_HOST_STAGING : WEB_PANELS.CONTACT_US_PAM_PROD,
                    FAQUrl: CONFIG.NODE_ENV === 'stag' ? WEB_PANELS.FAQ_HOST_STAGING : WEB_PANELS.FAQ_PAM_PROD,
                    cancelBookingUrl: CONFIG.NODE_ENV === 'stag' ? `https://desknowhoststg.appskeeper.com/host/booking/booking-details/${payload.bookingId}` : `${WEB_PANELS.HOST_PANEL_PROD}/host/booking/booking-details/${payload.bookingId}`,
                    tAndCUrl: CONFIG.NODE_ENV === 'stag' ? `https://desknowhoststg.appskeeper.com/content/term-condition` : `${WEB_PANELS.HOST_PANEL_PROD}/content/term-condition`,

                    calendarIndexUrl: CONFIG.NODE_ENV === 'stag' ?
                        `https://desknowhoststg.appskeeper.com/host/outlook-access?bookingId=${payload.bookingId}&userType=${ENUM.USER.TYPE.HOST}` :
                        `${WEB_PANELS.USER_PANEL_PROD}/host/outlook-access?bookingId=${payload.bookingId}&userType=${ENUM.USER.TYPE.HOST}`,

                    calendarIndexGmailUrl: CONFIG.NODE_ENV === 'stag' ?
                        `https://desknowhoststg.appskeeper.com/host/gmail-access?bookingId=${payload.bookingId}&userType=${ENUM.USER.TYPE.HOST}` :
                        `${WEB_PANELS.HOST_PANEL_PROD}/host/gmail-access?bookingId=${payload.bookingId}&userType=${ENUM.USER.TYPE.HOST}`
                });

                let pricePerUnit = (bookingDetails[0].basePrice).toFixed(2) / bookingDetails[0].quantity
                let bookingHtml = await TEMPLATER.makeHtmlTemplate(process.cwd() + "/src/views/Online_Booking/booking-confirmation.html", {
                    logo: CONSTANT.VERIFY_EMAIL_LOGO,
                    status: "pending",
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
                    userName: bookingDetails[0].userData.name,
                    propertyName: `${bookingDetails[0].propertyData.name}`,
                    propertyAddress: `${bookingDetails[0].propertyData.address}`,
                    propertyImage: `${bookingDetails[0].propertyData ?.images[0]}`,
                    hostEmail: `${bookingDetails[0] ?.propertyData ?.hostEmail}`,
                    hostName: `${bookingDetails[0] ?.propertyData ?.hostName}`,
                    addressPin: CONSTANT.ADDRESS_PIN,
                    fromDate: moment(bookingDetails[0].fromDate).format('MMM DD,YYYY'),
                    toDate: moment(bookingDetails[0].toDate).format('MMM DD,YYYY'),
                    bookingId: bookingDetails[0].bookingId,
                    subCategoryName: bookingDetails[0].subCategory.name,
                    quantity: bookingDetails[0].quantity,
                    totalPayable: formatPrice(bookingDetails[0].totalPayable),
                    paymentPlan: bookingDetails[0] ?.paymentPlan != ENUM.PAYMENT.PLAN.COMPLETE ? 'Monthly' : 'Complete',
                    bookingStatus: 'Successfully',
                    price: formatPrice(bookingDetails[0].basePrice),
                    taxPercentage: bookingDetails[0].taxPercentage,
                    taxes: formatPrice(bookingDetails[0].taxes),
                    pricePerUnit: formatPrice(pricePerUnit),
                    webPanelUrl: CONFIG.NODE_ENV === 'stag' ? WEB_PANELS.USER_PANEL_STAGING : WEB_PANELS.USER_PANEL_PROD,
                    contactUsUrl: CONFIG.NODE_ENV === 'stag' ? WEB_PANELS.CONTACT_US_STAGING : WEB_PANELS.CONTACT_US_PROD,
                    FAQUrl: CONFIG.NODE_ENV === 'stag' ? WEB_PANELS.FAQ_STAGING : WEB_PANELS.FAQ_PROD,
                    contactUrl: CONFIG.NODE_ENV === 'stag' ? `https://desknowuserstg.appskeeper.com/chat?userId=${bookingDetails[0].hostId}` : `${WEB_PANELS.USER_PANEL_PROD}/chat?userId=${bookingDetails[0].hostId}`,
                    cancelBookingUrl: CONFIG.NODE_ENV === 'stag' ? `https://desknowuserstg.appskeeper.com/profile/booking/detail/${payload.bookingId}` : `${WEB_PANELS.USER_PANEL_PROD}/profile/booking/detail/${payload.bookingId}`,
                    tAndCUrl: CONFIG.NODE_ENV === 'stag' ? `https://desknowuserstg.appskeeper.com/content/term-condition` : `${WEB_PANELS.USER_PANEL_PROD}/content/term-condition`,

                    calendarIndexUrl: CONFIG.NODE_ENV === 'stag' ?
                        `https://desknowuserstg.appskeeper.com/user/outlook-access?bookingId=${payload.bookingId}&userType=${ENUM.USER.TYPE.USER}` :
                        `${WEB_PANELS.USER_PANEL_PROD}/user/outlook-access?bookingId=${payload.bookingId}&userType=${ENUM.USER.TYPE.USER}`,

                    calendarIndexGmailUrl: CONFIG.NODE_ENV === 'stag' ?
                        `https://desknowuserstg.appskeeper.com/user/gmail-access?bookingId=${payload.bookingId}&userType=${ENUM.USER.TYPE.USER}` :
                        `${WEB_PANELS.USER_PANEL_PROD}/user/gmail-access?bookingId=${payload.bookingId}&userType=${ENUM.USER.TYPE.USER}`
                });

                await Promise.all([
                    this.createCalendarEvents(bookingDetails[0] ?.userData.userId, bookingDetails[0] ?.hostId, bookingDetails[0], req),
                    PushNotification.bookingRequestHost(hostToken, bookingDetails[0]),
                    PushNotification.sendBookingRequestPushNotification(userToken, bookingDetails[0]),
                    RecurringPayV1.update(
                        { bookingId: Types.ObjectId(bookingDetails[0]._id) },
                        { bookingStatus: ENUM.BOOKING.STATUS.ACCEPTED },
                        { multi: true }
                    ),
                    Mailer.sendMail(FORMAT.EMAIL.USER.BOOKING_EMAIL_CONFIRMATION_USER(`${bookingDetails[0].userData.email}`, bookingHtml, bookingDetails[0].propertyData.name, "pending")),
                    Mailer.sendMail(FORMAT.EMAIL.USER.BOOKING_EMAIL_CONFIRMATION_HOST(`${bookingDetails[0].propertyData.hostEmail}`, hostHtml, bookingDetails[0].propertyData.name)),
                    RecurringPayV1.update(
                        { bookingId: Types.ObjectId(bookingDetails[0]._id) },
                        { bookingStatus: ENUM.BOOKING.STATUS.ACCEPTED },
                        { multi: true }
                    ),
                    redisDOA.insertKeyInRedis(`${ENUM.REDIS.PENDING_BOOKING}_${bookingDetails[0]._id}`, 'toCancel'),
                    redisDOA.expireKey(`${ENUM.REDIS.PENDING_BOOKING}_${bookingDetails[0]._id}`, ENUM.REDIS.EXPIRY_TIME),
                    CoworkerV1.updateOne({
                        bookingId: bookingDetails[0] ?._id,
                        userId: bookingDetails[0] ?.userData.userId
                    }, {
                        name: bookingDetails[0] ?.userData.name,
                        email: bookingDetails[0] ?.userData.email,
                        status: 1,
                        image: bookingDetails[0] ?.userData.image,
                        ownerDetail: bookingDetails[0] ?.userData,
                        userId: bookingDetails[0] ?.userData.userId,
                        isOwner: 1,
                        bookingId: bookingDetails[0] ?._id,
                        bookingNumber: bookingDetails[0] ?.bookingId,
                        propertyId: bookingDetails[0] ?.propertyData.propertyId,
                        hostId: bookingDetails[0] ?.hostId,
                    }, { upsert: true })
                ])
                await GeneratePdf.invoice(payload.bookingId);
            }
            return bookingDetails[0];
        } catch (error) {
            console.error(">>>>>>>>>>>>2222", error);
        }
    }

    //<sync if they have connected accounts or not in both google and MS>
    async createCalendarEvents(userId: string, hostId: string, bookingDetails: any, req: Request) {
        try {
            const msEventDetail: any = {
                subject: `Booking Confirmed`,
                start: bookingDetails ?.fromDate,
                end: bookingDetails ?.toDate,
                body: `Your booking ${bookingDetails ?.bookingId} has been scheduled for property ${bookingDetails ?.propertyData.name}`
            }

            const [user, host]: any = await Promise.all([
                UserV1.findOne({ _id: Types.ObjectId(userId) }, { outlookCalendarSyncStatus: 1, googleCalendarSyncStatus: 1, google_refresh_token: 1 }),
                HostV1.findOne({ _id: Types.ObjectId(hostId) }, { outlookCalendarSyncStatus: 1, googleCalendarSyncStatus: 1, google_refresh_token: 1 })
            ]);

            if (user ?.outlookCalendarSyncStatus) {
                msEventDetail['userId'] = userId;
                msEventDetail['userType'] = ENUM.USER.TYPE.USER;
                CommonController.createOutlookEvent(req, msEventDetail);
            }
            if (host ?.outlookCalendarSyncStatus) {
                msEventDetail['userId'] = hostId;
                msEventDetail['userType'] = ENUM.USER.TYPE.HOST;
                CommonController.createOutlookEvent(req, msEventDetail);
            }
            if (user ?.googleCalendarSyncStatus) {
                GoogleCalendar.createEvent({ refresh_token: user ?.google_refresh_token }, bookingDetails);
            }
            if (host ?.googleCalendarSyncStatus) {
                GoogleCalendar.createHostEvent({ refresh_token: host ?.google_refresh_token }, bookingDetails);
            }
        } catch (error) {
            console.error(`we have an error in createCalendarEvents`, error);
        }
    }


    async giftCardCheckout(bookingParam: any, paymentIntent: any) {
        try {
            let bookingDetails: any;
            let objectToSave = {
                price: bookingParam.totalPayable,
                bookingId: bookingParam._id,
                status: ENUM.PAYMENT.STATUS.SUCCESS,
                propertyId: bookingParam.propertyData.propertyId,
                userId: bookingParam.userData.userId,
                paymentPlan: ENUM.PAYMENT.PLAN.COMPLETE,
                userType: ENUM.USER.TYPE.USER,
                hostId: bookingParam.hostId,
                transactionId: generateUniqueId('DSKTR'),
                paymentMethod: 'giftCard'
            }
            let [hostToken, userToken] = await Promise.all([
                HostV1.fetchHostDeviceToken(bookingParam.hostId),
                UserV1.fetchUserDeviceToken(bookingParam.userData.userId)
            ])
            let result = await new this.model(objectToSave).save();
            if (bookingParam.propertyData.autoAcceptUpcomingBooking == true) {
                bookingDetails = await Promise.all([
                    BookingV1.updateDocument({
                        _id: Types.ObjectId(bookingParam._id),
                        "propertyData.autoAcceptUpcomingBooking": true
                    }, {
                        giftCardStatus: ENUM.BOOKING.GIFT_CARD_STATUS.APPLIED,
                        paymentStatus: ENUM.PAYMENT.STATUS.SUCCESS,
                        bookingStatus: ENUM.BOOKING.STATUS.ACCEPTED,
                        transactionId: result.transactionId,
                        transactionType: result.paymentPlan,
                        paymentMode: result.paymentMethod,
                        transactionDate: result.createdAt,
                        acceptedOn: moment(),
                        paymentPlan: ENUM.PAYMENT.PLAN.COMPLETE
                    }),
                ])
                await Promise.all([
                    PushNotification.bookingSuccessfulHost(hostToken, bookingDetails[0]),
                    PushNotification.sendUserBookingSuccessPushNotification(userToken, bookingDetails[0]),
                    PropertyV1.updateOne({ _id: Types.ObjectId(bookingDetails[0] ?.propertyData ?.propertyId) },
                        {
                            $inc: {
                                totalBookingsCount: 1,
                                averageDuration: bookingDetails[0] ?.bookingDuration ?.totalDays,
                                unitsBooked: bookingDetails[0] ?.quantity
                            }
                        })
                ])
            } else {
                bookingDetails = await Promise.all([
                    BookingV1.updateDocument({
                        _id: Types.ObjectId(bookingParam._id),
                        "propertyData.autoAcceptUpcomingBooking": false
                    }, {
                        giftCardStatus: ENUM.BOOKING.GIFT_CARD_STATUS.APPLIED,
                        paymentStatus: ENUM.PAYMENT.STATUS.SUCCESS,
                        bookingStatus: ENUM.BOOKING.STATUS.PENDING,
                        transactionId: result.transactionId,
                        transactionType: result.paymentPlan,
                        paymentMode: result.paymentMethod,
                        transactionDate: result.createdAt,
                        paymentPlan: ENUM.PAYMENT.PLAN.COMPLETE
                    })
                ])
                await Promise.all([
                    PushNotification.bookingRequestHost(hostToken, bookingDetails[0]),
                    PushNotification.sendBookingRequestPushNotification(userToken, bookingDetails[0])
                ])
            }
            return bookingDetails[0];
        } catch (error) {
            console.error(">>>>>>>>>>>>2222", error);
            throw error;
        }
    }

    async updateStripeCustomerId(userId: any, data: any) {
        await UserV1.updateDocument({ _id: Types.ObjectId(userId) }, { stripeCustomerId: data.toString() })
        return;
    }

    async updateStripeHostCustomerId(userId: any, data: any) {
        await HostV1.updateDocument({ _id: Types.ObjectId(userId) }, { stripeCustomerId: data.toString() })
        return;
    }


    async updateStatusAfterPayment(payload: any, hostId: string) {
        try {
            //Accepted case
            let checkAutoAccept: any = await BookingV1.updateDocument({ _id: Types.ObjectId(payload.id) },
                {
                    paymentStatus: ENUM.PAYMENT.STATUS.SUCCESS,
                    bookingStatus: ENUM.BOOKING.STATUS.ACCEPTED,
                    acceptedOn: moment()
                }
            );
            let [hostToken, userToken] = await Promise.all(
                [
                    HostV1.fetchHostDeviceToken(hostId),
                    UserV1.fetchUserDeviceToken(checkAutoAccept.userData.userId)
                ]);

            let userHtml = await TEMPLATER.makeHtmlTemplate(process.cwd() + "/src/views/booking/action.user.html", {
                logo: CONSTANT.VERIFY_EMAIL_LOGO,
                bookingId: checkAutoAccept ?.bookingId,
                userName: checkAutoAccept ?.userData ?.name,
                hostName: checkAutoAccept ?.propertyData ?.hostName,
                status: `accepted`,
                redirectionUrl: CONFIG.NODE_ENV === 'stag' ? `https://desknowuserstg.appskeeper.com/profile/booking/detail/${payload.id}` : `${WEB_PANELS.USER_PANEL_PROD}/profile/booking/detail/${payload.id}`,
                webPanelUrl: CONFIG.NODE_ENV === 'stag' ? WEB_PANELS.USER_PANEL_STAGING : WEB_PANELS.USER_PANEL_PROD,
                contactUsUrl: CONFIG.NODE_ENV === 'stag' ? WEB_PANELS.CONTACT_US_STAGING : WEB_PANELS.CONTACT_US_PROD,
                FAQUrl: CONFIG.NODE_ENV === 'stag' ? WEB_PANELS.FAQ_STAGING : WEB_PANELS.FAQ_PROD
            });

            let hostHtml = await TEMPLATER.makeHtmlTemplate(process.cwd() + "/src/views/booking/action.host.html", {
                logo: CONSTANT.VERIFY_EMAIL_LOGO,
                bookingId: checkAutoAccept ?.bookingId,
                userName: checkAutoAccept ?.propertyData ?.hostName,
                status: `accepted`,
                redirectionUrl: CONFIG.NODE_ENV === 'stag' ? `https://desknowhoststg.appskeeper.com/host/booking/booking-details/${payload.id}` : `${WEB_PANELS.HOST_PANEL_PROD}/host/booking/booking-details/${payload.id}`,
                webPanelUrl: CONFIG.NODE_ENV === 'stag' ? WEB_PANELS.HOST_PANEL_STAGING : WEB_PANELS.HOST_PANEL_PROD,
                CONTACT_US: CONFIG.NODE_ENV === 'stag' ? WEB_PANELS.CONTACT_US_HOST_STAGING : WEB_PANELS.CONTACT_US_PAM_PROD,
                FAQUrl: CONFIG.NODE_ENV === 'stag' ? WEB_PANELS.FAQ_HOST_STAGING : WEB_PANELS.FAQ_PAM_PROD,
                calendarIndexUrl: `https://desknowuserdev.appskeeper.com/api/fetchIndex?bookingId=${payload.id}&userType=${ENUM.USER.TYPE.HOST}`
            });

            await Promise.all(
                [
                    PushNotification.bookingRequestHostSuccess(hostToken, checkAutoAccept),
                    PushNotification.sendBookingRequestUserSuccess(userToken, checkAutoAccept),
                    PropertyV1.updateOne({ _id: Types.ObjectId(checkAutoAccept.propertyData.propertyId) },
                        {
                            $inc: {
                                totalBookingsCount: 1,
                                averageDuration: checkAutoAccept.bookingDuration.totalDays,
                                unitsBooked: parseInt(checkAutoAccept.quantity)
                            }
                        }),
                    emailService.sendBookingAcceptedEmailToHost(hostHtml, payload.id, checkAutoAccept ?.propertyData ?.hostEmail, checkAutoAccept ?.userData ?.name, "accepted"),
                    emailService.sendBookingAcceptedEmailToUser(userHtml, payload.id, checkAutoAccept ?.userData ?.email, checkAutoAccept ?.propertyData ?.hostName, "accepted")
                ]);
            return checkAutoAccept;
        } catch (error) {
            console.error(">>>>>>>>>>>>2222", error);
            return Promise.reject(error)
        }
    }

    async updateStatusAfterReject(payload: any, hostId: string) {
        try {
            let checkAutoReject: any = await BookingV1.updateDocument({ _id: Types.ObjectId(payload.id) },
                { bookingStatus: ENUM.BOOKING.STATUS.REJECTED, rejectedOn: moment() }
            )
            let [hostToken, userToken] = await Promise.all(
                [
                    HostV1.fetchHostDeviceToken(hostId),
                    UserV1.fetchUserDeviceToken(checkAutoReject.userData.userId)
                ]);

            let userHtml = await TEMPLATER.makeHtmlTemplate(process.cwd() + "/src/views/booking/action.user.html", {
                logo: CONSTANT.VERIFY_EMAIL_LOGO,
                bookingId: checkAutoReject ?.bookingId,
                userName: checkAutoReject ?.userData ?.name,
                status: `rejected`,
                redirectionUrl: CONFIG.NODE_ENV === 'stag' ? `https://desknowuserstg.appskeeper.com/profile/booking/detail/${payload.id}` : `${WEB_PANELS.USER_PANEL_PROD}/profile/booking/detail/${payload.id}`,
                webPanelUrl: CONFIG.NODE_ENV === 'stag' ? WEB_PANELS.USER_PANEL_STAGING : WEB_PANELS.USER_PANEL_PROD,
                contactUsUrl: CONFIG.NODE_ENV === 'stag' ? WEB_PANELS.CONTACT_US_STAGING : WEB_PANELS.CONTACT_US_PROD,
                FAQUrl: CONFIG.NODE_ENV === 'stag' ? WEB_PANELS.FAQ_STAGING : WEB_PANELS.FAQ_PROD,
            });

            let hostHtml = await TEMPLATER.makeHtmlTemplate(process.cwd() + "/src/views/booking/action.host.html", {
                logo: CONSTANT.VERIFY_EMAIL_LOGO,
                bookingId: checkAutoReject ?.bookingId,
                userName: checkAutoReject ?.propertyData ?.hostName,
                status: `rejected`,
                redirectionUrl: CONFIG.NODE_ENV === 'stag' ? `https://desknowhoststg.appskeeper.com/host/booking/booking-details/${payload.id}` : `${WEB_PANELS.HOST_PANEL_PROD}/host/booking/booking-details/${payload.id}`,
                webPanelUrl: CONFIG.NODE_ENV === 'stag' ? WEB_PANELS.HOST_PANEL_STAGING : WEB_PANELS.HOST_PANEL_PROD,
                CONTACT_US: CONFIG.NODE_ENV === 'stag' ? WEB_PANELS.CONTACT_US_HOST_STAGING : WEB_PANELS.CONTACT_US_PAM_PROD,
                FAQUrl: CONFIG.NODE_ENV === 'stag' ? WEB_PANELS.FAQ_HOST_STAGING : WEB_PANELS.FAQ_PAM_PROD,
            });

            await Promise.all(
                [
                    PushNotification.bookingRequestHostReject(hostToken, checkAutoReject),
                    PushNotification.sendBookingRequestUserRejected(userToken, checkAutoReject),
                    PaymentController.refund(payload.id, {}),
                    emailService.sendBookingRejectedEmailToHost(hostHtml, payload.id, checkAutoReject ?.propertyData ?.hostEmail),
                    emailService.sendBookingRejectedEmailToUser(userHtml, payload.id, checkAutoReject ?.userData ?.email)
                ])
            return checkAutoReject;
        } catch (error) {
            console.error(">>>>>>>>>>>>2222", error);
            return Promise.reject(error)
        }
    }

    async fetchPaymentPlans(bookingId: string): Promise<any> {
        try {
            let bookingDetails: any = await BookingV1.findOne({ _id: Types.ObjectId(bookingId) });
            switch (bookingDetails.paymentPlan) {
                case ENUM.PAYMENT.PLAN.COMPLETE:
                    let completePlan = {
                        paymentPlan: bookingDetails.paymentPlan,
                        totalPayable: bookingDetails.totalPayable,
                        transactionDate: bookingDetails.transactionDate
                    }
                    return completePlan;
                case ENUM.PAYMENT.PLAN.MONTHLY:
                    let monthlyPlan = await RecurringPayV1.findMany({ bookingId: Types.ObjectId(bookingId) });
                    return monthlyPlan;
                default:
                    {
                        let monthlyPlan = await RecurringPayV1.findMany({ bookingId: Types.ObjectId(bookingId) });
                        return monthlyPlan;
                    }
            }
        } catch (error) {
            console.error(`we have an error while fetching payment plan ==> ${error}`);
        }
    }

    async getTransactionData(bookingId: any): Promise<any> {
        try {
            let transactionData = await paymentModel.findOne({ bookingId: Types.ObjectId(bookingId) }, { stripeTransactionId: 1, userId: 1, price: 1 });
            return transactionData;
        } catch (error) {
            return Promise.reject(error)
        }
    }

    async fetchTotalPayout(payload: any) {
        try {
            let pipeline: any = [];
            let matchCriteria: any = []
            if (payload && payload.status) {
                matchCriteria.push({ 'bookingStatus': payload.status });
            } else {
                matchCriteria.push({ 'bookingStatus': { $ne: 5 } });
            }
            if (payload.fromDate) matchCriteria.push({ createdAt: { $gte: new Date(payload.fromDate) } })
            if (payload.toDate) matchCriteria.push({ createdAt: { $lte: new Date(payload.toDate) } })
            pipeline.push({ $match: { $and: matchCriteria } })
            pipeline.push(
                { $group: { _id: null, count: { $sum: 1 } } },
                { $project: { _id: 0 } }
            )
            let details: any = await BookingV1.basicAggregate(pipeline);
            details && details.length > 0 ? details = details[0] : details = { count: 0 }
            return details;
        } catch (error) {
            console.error(`we have an error while calculating total payout ==> ${error}`);
        }
    }

    async calculateBookingDuration(endDate: any, startDate: any, payload: any): Promise<any> {
        try {
            switch (payload ?.bookingType) {
                case ENUM.USER.BOOKING_TYPE.CUSTOM:
                    const diffTime = Math.abs(endDate - startDate);
                    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    let monthTemp = days / CONSTANT.CALENDER_STATICS.MONTH;
                    let totalDays = Math.trunc(days % CONSTANT.CALENDER_STATICS.MONTH);
                    let totalMonths = Math.trunc(monthTemp % CONSTANT.CALENDER_STATICS.MONTH);
                    let totalYear = Math.trunc(monthTemp / CONSTANT.CALENDER_STATICS.TOTAL_MONTHS);
                    return {
                        bookingDuration: {
                            days: totalDays,
                            months: totalMonths,
                            year: totalYear,
                            totalDays: days
                        }
                    }
                case ENUM.USER.BOOKING_TYPE.HOURLY:
                    return {
                        bookingDuration: {
                            totalHours: payload.totalHours
                        }
                    }
                case ENUM.USER.BOOKING_TYPE.MONTHLY:
                    return {
                        bookingDuration: {
                            months: payload ?.totalMonths,
                        }
                    }
            }
        } catch (error) {
            console.error(`we have an error in fetchCalculatedPrice ==> ${error}`);
        }
    }
}

export const PayV1 = new PaymentEntity(paymentModel);