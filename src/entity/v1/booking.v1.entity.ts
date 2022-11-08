/**
 * @file admin.v1.entity
 * @description defines v1 admin entity methods
 * @author Desk Now Dev Team
*/

import { Model, Types } from "mongoose";
import BaseEntity from "../base.entity";
import BookingModel from "@models/booking.model";
import { BookingCartV1, FavouriteV1, CalendarV1, PropertySpaceV1, HostV1, RecurringPayV1, PropertyV1, CoworkerV1, UserV1, PayV1, PartnerFloorV1 } from "@entity";
import { CONFIG, CONSTANT, DATABASE, ENUM, FORMAT, WEB_PANELS } from "@common";
import { formattedTime, calcPaymentPlan, generateUniqueId, roundOffNumbers, formatPrice, PushNotification, Mailer, redisDOA } from "@services";
import moment from "moment";
import { TEMPLATER } from "../../htmlHelper";

class BookingEntity extends BaseEntity {
    constructor(model: Model<any>) {
        super(model);
    }

    async updateEmployeeBookingStatus(payload: any, bookingDetail: any, req: any) {
        try {
            let bookingDetails: any;
            if (bookingDetail?.prolongedStatus === ENUM.BOOKING.PROLONGED_STATUS.PENDING
                && bookingDetail?.prolongBookingId) {
                await BookingV1.updateOne(
                    { _id: Types.ObjectId(bookingDetail?.prolongBookingId) },
                    {
                        $set: {
                            prolongedStatus: ENUM.BOOKING.PROLONGED_STATUS.SUCCESS,
                            prolongBookingId: Types.ObjectId(bookingDetail?.prolongBookingId)
                        }
                    }, {});
            }
            let objectToSave = {
                bookingId: bookingDetail._id,
                status: ENUM.PAYMENT.STATUS.SUCCESS,
                propertyId: bookingDetail.propertyData.propertyId,
                userId: bookingDetail.userData.userId,
                userType: ENUM.USER.TYPE.USER,
                hostId: bookingDetail.hostId,
                transactionId: generateUniqueId('DSKTR'),
                paymentMethod: payload.paymentMethod
            }
            let [hostToken, userToken] = await Promise.all([
                HostV1.fetchHostDeviceToken(bookingDetail.hostId),
                UserV1.fetchUserDeviceToken(bookingDetail.userData.userId)
            ])
            let result = await PayV1.updateEmployeeBookingPayDetails(objectToSave);
            if (bookingDetail.propertyData.autoAcceptUpcomingBooking == true) {
                bookingDetails = await Promise.all([
                    BookingV1.updateDocument({
                        _id: Types.ObjectId(payload.bookingId),
                        "propertyData.autoAcceptUpcomingBooking": true
                    }, {
                        paymentStatus: ENUM.PAYMENT.STATUS.SUCCESS,
                        bookingStatus: ENUM.BOOKING.STATUS.ACCEPTED,
                        transactionId: result.transactionId,
                        paymentMode: result.paymentMethod,
                        transactionDate: result.createdAt,
                        acceptedOn: moment()
                    }, { new: true }),
                ]);
                let hostHtml = await TEMPLATER.makeHtmlTemplate(process.cwd() + "/src/views/Online_Booking/host_booking_emailer.html", {
                    logo: CONSTANT.VERIFY_EMAIL_LOGO,
                    propertyName: `${bookingDetails[0].propertyData.name}`,
                    propertyAddress: `${bookingDetails[0].propertyData.address}`,
                    propertyImage: `${bookingDetails[0].propertyData?.images[0]}`,
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
                        `https://desknowuserstg.appskeeper.com/user/outlook-access?bookingId=${payload.bookingId}&userType=${ENUM.USER.TYPE.HOST}` :
                        `${WEB_PANELS.USER_PANEL_PROD}/host/outlook-access?bookingId=${payload.bookingId}&userType=${ENUM.USER.TYPE.HOST}`,

                    calendarIndexGmailUrl: CONFIG.NODE_ENV === 'stag' ?
                        `https://desknowuserstg.appskeeper.com/user/gmail-access?bookingId=${payload.bookingId}&userType=${ENUM.USER.TYPE.HOST}` :
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
                    propertyImage: `${bookingDetails[0].propertyData?.images[0]}`,
                    hostEmail: `${bookingDetails[0]?.propertyData?.hostEmail}`,
                    hostName: `${bookingDetails[0]?.propertyData?.hostName}`,
                    addressPin: CONSTANT.ADDRESS_PIN,
                    fromDate: moment(bookingDetails[0].fromDate).format('MMM DD,YYYY'),
                    toDate: moment(bookingDetails[0].toDate).format('MMM DD,YYYY'),
                    bookingId: bookingDetails[0].bookingId,
                    subCategoryName: bookingDetails[0].subCategory.name,
                    quantity: bookingDetails[0].quantity,
                    bookingStatus: 'Successfully',
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
                    PayV1.createCalendarEvents(bookingDetail.userData.userId, bookingDetail.hostId, bookingDetail, req),
                    PushNotification.bookingSuccessfulHost(hostToken, bookingDetails[0]),
                    PushNotification.sendUserBookingSuccessPushNotification(userToken, bookingDetails[0]),
                    PropertyV1.updateOne({ _id: Types.ObjectId(bookingDetails[0]?.propertyData?.propertyId) },
                        {
                            $inc: {
                                totalBookingsCount: 1,
                                averageDuration: bookingDetails[0]?.bookingDuration?.totalDays,
                                unitsBooked: bookingDetails[0]?.quantity
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
                        bookingId: bookingDetails[0]?._id,
                        userId: bookingDetails[0]?.userData.userId
                    }, {
                        name: bookingDetails[0]?.userData.name,
                        email: bookingDetails[0]?.userData.email,
                        status: 1,
                        image: bookingDetails[0]?.userData.image,
                        ownerDetail: bookingDetails[0]?.userData,
                        userId: bookingDetails[0]?.userData.userId,
                        isOwner: 1,
                        bookingId: bookingDetails[0]?._id,
                        bookingNumber: bookingDetails[0]?.bookingId,
                        propertyId: bookingDetails[0]?.propertyData.propertyId,
                        hostId: bookingDetails[0]?.hostId,
                    }, { upsert: true })
                ])

                 UserV1.updateOne({_id:bookingDetail.userData.userId},{$inc:{bookingCount:1}})
                // await GeneratePdf.invoice(payload.bookingId);
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
                    })
                ])

                let hostHtml = await TEMPLATER.makeHtmlTemplate(process.cwd() + "/src/views/Online_Booking/host_booking_emailer.html", {
                    logo: CONSTANT.VERIFY_EMAIL_LOGO,
                    propertyName: `${bookingDetails[0].propertyData.name}`,
                    propertyAddress: `${bookingDetails[0].propertyData.address}`,
                    fromDate: moment(bookingDetails[0].fromDate).format('MMM DD,YYYY'),
                    toDate: moment(bookingDetails[0].toDate).format('MMM DD,YYYY'),
                    bookingId: bookingDetails[0].bookingId,
                    propertyImage: `${bookingDetails[0].propertyData?.images[0]}`,
                    subCategoryName: bookingDetails[0].subCategory.name,
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
                        `https://desknowuserstg.appskeeper.com/user/outlook-access?bookingId=${payload.bookingId}&userType=${ENUM.USER.TYPE.USER}` :
                        `${WEB_PANELS.USER_PANEL_PROD}/user/outlook-access?bookingId=${payload.bookingId}&userType=${ENUM.USER.TYPE.USER}`,

                    calendarIndexGmailUrl: CONFIG.NODE_ENV === 'stag' ?
                        `https://desknowuserstg.appskeeper.com/user/gmail-access?bookingId=${payload.bookingId}&userType=${ENUM.USER.TYPE.USER}` :
                        `${WEB_PANELS.USER_PANEL_PROD}/user/gmail-access?bookingId=${payload.bookingId}&userType=${ENUM.USER.TYPE.USER}`
                });
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
                    propertyImage: `${bookingDetails[0].propertyData?.images[0]}`,
                    hostEmail: `${bookingDetails[0]?.propertyData?.hostEmail}`,
                    hostName: `${bookingDetails[0]?.propertyData?.hostName}`,
                    addressPin: CONSTANT.ADDRESS_PIN,
                    fromDate: moment(bookingDetails[0].fromDate).format('MMM DD,YYYY'),
                    toDate: moment(bookingDetails[0].toDate).format('MMM DD,YYYY'),
                    bookingId: bookingDetails[0].bookingId,
                    subCategoryName: bookingDetails[0].subCategory.name,
                    quantity: bookingDetails[0].quantity,
                    bookingStatus: 'Successfully',
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
                    PayV1.createCalendarEvents(bookingDetail.userData.userId, bookingDetail.hostId, bookingDetail, req),
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
                        bookingId: bookingDetails[0]?._id,
                        userId: bookingDetails[0]?.userData.userId
                    }, {
                        name: bookingDetails[0]?.userData.name,
                        email: bookingDetails[0]?.userData.email,
                        status: 1,
                        image: bookingDetails[0]?.userData.image,
                        ownerDetail: bookingDetails[0]?.userData,
                        userId: bookingDetails[0]?.userData.userId,
                        isOwner: 1,
                        bookingId: bookingDetails[0]?._id,
                        bookingNumber: bookingDetails[0]?.bookingId,
                        propertyId: bookingDetails[0]?.propertyData.propertyId,
                        hostId: bookingDetails[0]?.hostId,
                    }, { upsert: true })
                ])
                // await GeneratePdf.invoice(payload.bookingId);
            }
            return bookingDetail;
        } catch (error) {
            console.error(`we have an error in checkout module ==> ${error}`);
        }
    }
    async normalUserDurationCheck(payload: any, offset: any): Promise<any> {
        try {
            switch (payload?.bookingType) {
                case ENUM.USER.BOOKING_TYPE.CUSTOM:
                    return await this.fetchCustomUnitAvailability(payload, offset);
                case ENUM.USER.BOOKING_TYPE.HOURLY:
                    return await this.fetchHourlyUnitAvailability(payload, offset);
                case ENUM.USER.BOOKING_TYPE.MONTHLY:
                    return await this.fetchMonthlyUnitAvailability(payload, offset);
            }
        } catch (error) {
            console.error(`we have an error while durationCheck ==> ${error}`);
        }
    }

    async fetchCustomUnitAvailability(payload: any, offset: number): Promise<any> {
        try {
            let startTime = DATABASE.DATE_CONSTANTS.calculateCurrentDate(payload.fromDate, payload.offset)
            let endTime = DATABASE.DATE_CONSTANTS.toDate(payload.toDate, payload.offset)
            let [spaceDetail, bookingDetail]: any = await Promise.all(
                [
                    PropertySpaceV1.findOne({ _id: Types.ObjectId(payload.spaceId) }, { units: 1 }),
                    BookingV1.findMany({
                        "spaceId": Types.ObjectId(payload.spaceId),
                        isEmployee: false,
                        bookingType: ENUM.USER.BOOKING_TYPE.CUSTOM,
                        $or: [
                            { fromDate: { $gte: startTime, $lte: endTime }, toDate: { $lte: startTime } },
                            { fromDate: { $gte: startTime, $lte: endTime }, toDate: { $gte: endTime } },
                            { fromDate: { $gte: startTime, $lte: endTime }, toDate: { $lte: endTime } },
                            { fromDate: { $lte: startTime }, toDate: { $gte: startTime } }
                        ],
                        bookingStatus: {
                            $nin: [
                                ENUM.BOOKING.STATUS.ABANDONED,
                                ENUM.BOOKING.STATUS.CANCELLED,
                                ENUM.BOOKING.STATUS.REJECTED,
                                ENUM.BOOKING.STATUS.COMPLETED
                            ]
                        }
                    }, { quantity: 1, fromDate: 1, toDate: 1 })
                ]);
            let totalUnitsAvailable: any = 0 //units occupied
            let availableUnits;
            if (bookingDetail?.length) {
                for (let i = 0; i < bookingDetail.length; i++) {
                    totalUnitsAvailable = totalUnitsAvailable + bookingDetail[i].quantity;
                }
                //new check for hours units occupied in same day and last day
                for (let i = 0; i < bookingDetail.length; i++) {
                    availableUnits = spaceDetail.units.custom - totalUnitsAvailable;
                    if (payload.quantity > availableUnits) {
                        payload['availableUnits'] = 0;
                        payload['quantity'] = payload?.quantity > 1 ? payload?.quantity - 1 : payload?.quantity;
                        break;
                    }
                }
            } else {
                if (payload.quantity > spaceDetail?.units?.custom) {
                    payload['availableUnits'] = 0;
                    payload['quantity'] = payload?.quantity > 1 ? payload?.quantity - 1 : payload?.quantity;
                } else {
                    availableUnits = spaceDetail?.units?.custom;
                }
            }
            return payload;
        } catch (error) {
            console.error(`we have an error in fetchCustomUnitAvailability ==> ${error}`);
        }
    }

    async fetchMonthlyUnitAvailability(payload: any, offset: number): Promise<any> {
        try {

            let startTime = DATABASE.DATE_CONSTANTS.calculateCurrentDate(payload.fromDate, payload.offset)
            let endTime = DATABASE.DATE_CONSTANTS.toDate(payload.toDate, payload.offset)

            let [spaceDetail, bookingDetail]: any = await Promise.all(
                [
                    PropertySpaceV1.findOne({ _id: Types.ObjectId(payload.spaceId) }, { units: 1 }),
                    BookingV1.findMany({
                        isEmployee: false,
                        "spaceId": Types.ObjectId(payload.spaceId),
                        bookingType: ENUM.USER.BOOKING_TYPE.MONTHLY,
                        $or: [
                            { fromDate: { $gte: startTime, $lte: endTime }, toDate: { $lte: startTime } },
                            { fromDate: { $gte: startTime, $lte: endTime }, toDate: { $gte: endTime } },
                            { fromDate: { $gte: startTime, $lte: endTime }, toDate: { $lte: endTime } },
                            { fromDate: { $lte: startTime }, toDate: { $gte: startTime } }
                        ],
                        bookingStatus: {
                            $nin: [
                                ENUM.BOOKING.STATUS.ABANDONED,
                                ENUM.BOOKING.STATUS.CANCELLED,
                                ENUM.BOOKING.STATUS.REJECTED,
                                ENUM.BOOKING.STATUS.COMPLETED
                            ]
                        }
                    }, { quantity: 1, fromDate: 1, toDate: 1 })
                ]);
            let totalUnitsAvailable: any = 0 //units occupied
            let availableUnits;
            if (bookingDetail?.length) {
                for (let i = 0; i < bookingDetail.length; i++) {
                    totalUnitsAvailable = totalUnitsAvailable + bookingDetail[i].quantity;
                }
                //new check for hours units occupied in same day and last day
                for (let i = 0; i < bookingDetail.length; i++) {
                    availableUnits = spaceDetail.units.monthly - totalUnitsAvailable;
                    if (payload.quantity > availableUnits) {
                        payload['availableUnits'] = 0;
                        payload['quantity'] = payload?.quantity > 1 ? payload?.quantity - 1 : payload?.quantity;
                        break;
                    }
                }
            } else {
                if (payload.quantity > spaceDetail?.units?.monthly) {
                    payload['availableUnits'] = 0;
                    payload['quantity'] = payload?.quantity > 1 ? payload?.quantity - 1 : payload?.quantity;
                } else {
                    availableUnits = spaceDetail?.units?.monthly;
                }
            }
            return payload;
        } catch (error) {
            console.error(`we have an error in fetchMonthlyUnitAvailability ==> ${error}`);
        }
    }

    async fetchHourlyUnitAvailability(payload: any, offset: number): Promise<any> {
        try {
            let startTime = DATABASE.DATE_CONSTANTS.hourlyFromDate(payload.fromDate, payload.offset)
            let endTime = DATABASE.DATE_CONSTANTS.hourlyToDate(payload.toDate, payload.offset)

            let [spaceDetail, bookingDetail]: any = await Promise.all(
                [
                    PropertySpaceV1.findOne({ _id: Types.ObjectId(payload.spaceId) }, { units: 1 }),
                    BookingV1.findMany({
                        "spaceId": Types.ObjectId(payload.spaceId),
                        isEmployee: false,
                        bookingType: ENUM.USER.BOOKING_TYPE.HOURLY,
                        $or: [
                            { fromDate: { $gte: startTime, $lte: endTime }, toDate: { $lte: startTime } },
                            { fromDate: { $gte: startTime, $lte: endTime }, toDate: { $gte: endTime } },
                            { fromDate: { $gte: startTime, $lte: endTime }, toDate: { $lte: endTime } },
                            { fromDate: { $lte: startTime }, toDate: { $gte: startTime } }
                        ],
                        bookingStatus: {
                            $nin: [
                                ENUM.BOOKING.STATUS.ABANDONED,
                                ENUM.BOOKING.STATUS.CANCELLED,
                                ENUM.BOOKING.STATUS.REJECTED,
                                ENUM.BOOKING.STATUS.COMPLETED
                            ]
                        }
                    }, { quantity: 1, fromDate: 1, toDate: 1 })
                ]);
            let totalUnitsAvailable: any = 0 //units occupied
            let availableUnits;
            if (bookingDetail?.length) {
                for (let i = 0; i < bookingDetail.length; i++) {
                    totalUnitsAvailable = totalUnitsAvailable + bookingDetail[i].quantity;
                }
                //new check for hours units occupied in same day and last day
                for (let i = 0; i < bookingDetail.length; i++) {
                    availableUnits = spaceDetail.units.hourly - totalUnitsAvailable;
                    if (payload.quantity > availableUnits) {
                        payload['availableUnits'] = 0;
                        payload['quantity'] = payload?.quantity > 1 ? payload?.quantity - 1 : payload?.quantity;
                        break;
                    }
                }
            } else {
                if (payload.quantity > spaceDetail?.units?.hourly) {
                    payload['availableUnits'] = 0;
                    payload['quantity'] = payload?.quantity > 1 ? payload?.quantity - 1 : payload?.quantity;
                } else {
                    availableUnits = spaceDetail?.units?.hourly;
                }
            }
            return payload;
        } catch (error) {
            console.error(`we have an error in fetchHourlyUnitAvailability ==> ${error}`);
        }
    }

    async employeeDurationCheck(payload: any, offset: any): Promise<any> {
        try {
            let startTime
            let endTime
            //!!to do check if fill property is allocated to partner or its partially allocated
            if (payload.bookingType == ENUM.USER.BOOKING_TYPE.HOURLY) {
                startTime = DATABASE.DATE_CONSTANTS.hourlyFromDate(payload.fromDate, payload.offset)
                endTime = DATABASE.DATE_CONSTANTS.hourlyToDate(payload.toDate, payload.offset)
            } else {
                startTime = DATABASE.DATE_CONSTANTS.calculateCurrentDate(payload.fromDate, payload.offset)
                endTime = DATABASE.DATE_CONSTANTS.toDate(payload.toDate, payload.offset)
            }
            let [spaceDetail, bookingDetail]: any = await Promise.all(
                [
                    PartnerFloorV1.findOne({ spaceId: Types.ObjectId(payload.spaceId), status: ENUM.PROPERTY.STATUS.ACTIVE }, { employeeUnits: 1 }),
                    BookingV1.findMany({
                        isEmployee: true,
                        "spaceId": Types.ObjectId(payload.spaceId),
                        $or: [
                            { fromDate: { $gte: startTime, $lte: endTime }, toDate: { $lte: startTime } },
                            { fromDate: { $gte: startTime, $lte: endTime }, toDate: { $gte: endTime } },
                            { fromDate: { $gte: startTime, $lte: endTime }, toDate: { $lte: endTime } },
                            { fromDate: { $lte: startTime }, toDate: { $gte: startTime } }
                        ],
                        bookingStatus: {
                            $nin: [
                                ENUM.BOOKING.STATUS.ABANDONED,
                                ENUM.BOOKING.STATUS.CANCELLED,
                                ENUM.BOOKING.STATUS.REJECTED,
                                ENUM.BOOKING.STATUS.COMPLETED,
                                ENUM.BOOKING.STATUS.PENDING
                            ]
                        }
                    }, { quantity: 1, fromDate: 1, toDate: 1 })
                ]);
            let totalUnitsAvailable: any = 0;
            let availableUnits;
            if (bookingDetail?.length) {
                for (let i = 0; i < bookingDetail.length; i++) {
                    totalUnitsAvailable = totalUnitsAvailable + bookingDetail[i].quantity;
                }
                //new check for hours units occupied in same day and last day
                for (let i = 0; i < bookingDetail.length; i++) {
                    availableUnits = spaceDetail?.employeeUnits - totalUnitsAvailable;
                    if (payload.quantity > availableUnits) {
                        payload['availableUnits'] = 0;
                        payload['quantity'] = payload?.quantity > 1 ? payload?.quantity - 1 : payload?.quantity;
                        break;
                    }
                }
            } else {
                if (payload.quantity > spaceDetail?.employeeUnits) {
                    payload['availableUnits'] = 0;
                    payload['quantity'] = payload?.quantity > 1 ? payload?.quantity - 1 : payload?.quantity;
                } else {
                    availableUnits = spaceDetail?.employeeUnits;
                }
            }
            return payload;
        } catch (error) {
            console.error(`we have an error while durationCheck ==> ${error}`);
        }
    }

    async userBookSpace(cartData: any, headers: any, payload: any) {
        try {
            let deviceId = headers.devicedetails.deviceId;
            let dataToInsert = {
                cartId: cartData._id,
                deviceId: deviceId,
                quantity: cartData.quantity,
                cartInfo: cartData.cartInfo,
                fromDate: moment(cartData.fromDate).toISOString(),
                toDate: moment(cartData.toDate).toISOString(),
                occupancy: cartData.occupancy * cartData.quantity,
                userData: {
                    userId: cartData.userData.userId,
                    status: cartData.userData.status,
                    name: cartData.userData.name,
                    image: cartData.userData.image,
                    phoneNo: cartData.userData.phoneNo,
                    countryCode: cartData.userData.countryCode,
                    createdAt: cartData.userData.createdAt,
                    email: cartData.userData.email,
                    dob: cartData.userData.dob,
                    profileStatus: cartData.userData.profileStatus,
                    bio: cartData.userData.bio
                },
                taxes: cartData?.taxes,
                taxPercentage: cartData?.taxPercentage,
                offerPrice: cartData?.offerPrice ? cartData?.offerPrice : 0,
                offerLabelType: cartData?.offerLabelType ? cartData?.offerLabelType : {},
                shareUrl: cartData.shareUrl,
                bookingId: generateUniqueId('DSK'),
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
                hostId: cartData.hostId,
                totalPayable: cartData.totalPayable,
                monthlyPayable: cartData?.monthlyPayable ? await roundOffNumbers(cartData.monthlyPayable) : 0,
               // pricing: cartData.pricing,
                totalSpaceCapacity: cartData.totalSpaceCapacity,
                basePrice: cartData.basePrice,
                bookingDuration: {
                    months: cartData.bookingDuration?.months,
                    days: cartData.bookingDuration?.days,
                    totalDays: cartData.bookingDuration?.totalDays,
                    totalHours: cartData.bookingDuration?.totalHours
                },
                category: cartData.category,
                subCategory: cartData.subCategory,
                bookingMode: 0,
                floorDescription: cartData.floorDescription,
                floorNumber: cartData.floorNumber,
                partnerId: cartData.partnerId,
                isEmployee: cartData.isEmployee,
                floorLabel: cartData.floorLabel,
                bookingType: cartData.bookingType,
                adminCommissionAmount:cartData.adminCommissionAmount
            }
            let response = await new this.model(dataToInsert).save();

            if (payload?.extended === true) {
                await BookingV1.updateOne(
                    { _id: Types.ObjectId(response?._id) },
                    {
                        $set: {
                            prolongedStatus: ENUM.BOOKING.PROLONGED_STATUS.PENDING,
                            prolongBookingId: Types.ObjectId(cartData.prolongBookingId)
                        }
                    }, {});
            }

            Promise.all([
                BookingCartV1.remove({ _id: cartData._id }),
                BookingV1.updateCalendarSchedule(dataToInsert, response?._id),
                FavouriteV1.updateOne(
                    {
                        "property._id": cartData.propertyData.propertyId
                    },
                    { $set: { "property.isBooked": true } }),
                HostV1.updateOne({ _id: Types.ObjectId(cartData.hostId) }, { $pull: { deletedClient: Types.ObjectId(cartData.userData.userId) } })
            ]);

            return response;
        } catch (error) {
            console.error(`we have an error ==> ${error}`);
            return Promise.reject(error);
        }
    }


    async userEmployeeBookSpace(cartData: any, headers: any, payload: any) {
        try {
            let deviceId = headers.devicedetails.deviceId;
            let dataToInsert = {
                cartId: cartData._id,
                cartInfo: cartData.cartInfo,
                bookingType: cartData.bookingType,
                deviceId: deviceId,
                quantity: cartData.quantity,
                fromDate: moment(cartData.fromDate).toISOString(),
                toDate: moment(cartData.toDate).toISOString(),
                occupancy: cartData.occupancy * cartData.quantity,
                userData: {
                    userId: cartData.userData.userId,
                    status: cartData.userData.status,
                    name: cartData.userData.name,
                    image: cartData.userData.image,
                    phoneNo: cartData.userData.phoneNo,
                    countryCode: cartData.userData.countryCode,
                    createdAt: cartData.userData.createdAt,
                    email: cartData.userData.email,
                    dob: cartData.userData.dob,
                    profileStatus: cartData.userData.profileStatus,
                    bio: cartData.userData.bio,
                },
                shareUrl: cartData.shareUrl,
                bookingId: generateUniqueId('DSK'),
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
                hostId: cartData.hostId,
                totalSpaceCapacity: cartData.totalSpaceCapacity,
                bookingDuration: {
                    year: cartData.bookingDuration?.year,
                    months: cartData.bookingDuration?.months,
                    days: cartData.bookingDuration?.days,
                    totalDays: cartData.bookingDuration?.totalDays,
                    totalHours: cartData.bookingDuration?.totalHours,
                },
                category: cartData.category,
                subCategory: cartData.subCategory,
                bookingMode: 0,
                floorDescription: cartData.floorDescription,
                floorNumber: cartData.floorNumber,
                partnerId: cartData.partnerId,
                isEmployee: cartData.isEmployee,
                floorLabel: cartData.floorLabel
            }
            let response = await new this.model(dataToInsert).save();

            if (payload?.extended === true) {
                await BookingV1.updateOne(
                    { _id: Types.ObjectId(response?._id) },
                    {
                        $set: {
                            prolongedStatus: ENUM.BOOKING.PROLONGED_STATUS.PENDING,
                            prolongBookingId: Types.ObjectId(cartData.prolongBookingId)
                        }
                    }, {});
            }

            Promise.all([
                BookingCartV1.remove({ _id: cartData._id }),
                BookingV1.updateCalendarSchedule(dataToInsert, response?._id),
                FavouriteV1.updateOne(
                    {
                        "property._id": cartData.propertyData.propertyId
                    },
                    { $set: { "property.isBooked": true } }),
                HostV1.updateOne({ _id: Types.ObjectId(cartData.hostId) }, { $pull: { deletedClient: Types.ObjectId(cartData.userData.userId) } })
            ]);
            return response;
        } catch (error) {
            console.error(`we have an error ==> ${error}`);
            throw error;
        }
    }

    async fetchBookingDetails(bookingId: any) {
        try {
          //  let orderData: any = await BookingV1.findOne({ _id: Types.ObjectId(bookingId) }, { "propertyData.propertyId": 1, "cartInfo": 1, quantity: 1, fromDate: 1, toDate: 1 });
            let pipeline: any = [];
            let matchCondition: any = {};
            matchCondition['_id'] =Types.ObjectId(bookingId);
            // matchCondition['status'] = ENUM.PROPERTY.STATUS.ACTIVE;
            // let spaceIds = orderData.cartInfo.map((x: { spaceId: any; }) => x.spaceId );
            // orderData.cartInfo ? matchCondition['_id'] = { $in: spaceIds } : "";

            // let pipelineMatchCondition: any = {
            //     "$expr": {
            //         "$and": [
            //             { "$in": ["$$spaceId", "$cartInfo.spaceId"] },
            //             { "$eq": ["$_id", Types.ObjectId(bookingId)] }
            //         ]
            //     }
            // };

            pipeline.push(
                 { '$match': matchCondition },
                // {
                //     "$lookup": {
                //         "from": "booking",
                //         "let": {
                //             "spaceId": "$_id"
                //         },
                //         "pipeline": [
                //             {
                //                 "$match": pipelineMatchCondition
                //             },
                            {
                                $project:
                                {
                                    quantity: 1,
                                    _id: 1,
                                    fromDate: 1,
                                    toDate: 1,
                                    deviceId: 1,
                                    userId: 1,
                                    propertyData: 1,
                                    offerPrice: 1,
                                    offerLabelType: 1,
                                    bookingDuration: 1,
                                    basePrice: 1,
                                    taxes: 1,
                                    totalPayable: 1,
                                    categoryData: {
                                        category: "$category",
                                        subCategory: "$subCategory"
                                    },
                                    giftCardAmount: 1,
                                    giftCardNo: 1,
                                    isEmployee: 1,
                                    bookingType: 1,
                                    taxPercentage: 1,
                                    cartInfo:1
                                },
                            },
                //         ],
                //         "as": "cartInfo"
                //     }
                // },
                // { $unwind: "$cartInfo" },
                {
                    "$lookup": {
                        "from": "properties",
                        "let": {
                            "propertyId": "$propertyData.propertyId",
                            taxPercentage: '$taxPercentage'
                        },
                        "pipeline": [
                            {
                                "$match": {
                                    "$expr": {
                                        "$and": [
                                            { "$eq": ["$_id", "$$propertyId"] },
                                        ]
                                    }
                                }
                            },
                            {
                                $project:
                                {
                                    _id: 0,
                                    rating: 1,
                                    taxPercentage: '$$taxPercentage'
                                }
                            }
                        ],
                        "as": "reviewDetail"
                    }
                },
                { $unwind: "$reviewDetail" }
            );
            let response = await BookingV1.basicAggregate(pipeline);
            return response;
        } catch (error) {
            console.error(`we have an error ==> ${error}`);
            return Promise.reject(error);
        }
    }

    async fetchPaymentPlanAndPrice(payload: any) {
        try {
            let bookingDetail: any = await BookingV1.findOne(
                { _id: Types.ObjectId(payload.bookingId) },
                {
                    fromDate: 1,
                    toDate: 1,
                    spaceId: 1,
                    pricing: 1,
                    totalPayable: 1,
                    quantity: 1,
                    giftCardAmount: 1,
                    monthlyPayable: 1,
                    bookingDuration: 1,
                    offerPrice: 1
                });

            const { endDate, startDate } = formattedTime({ fromDate: bookingDetail.fromDate, toDate: bookingDetail.toDate });
            let calculatedPrice: any = await calcPaymentPlan(endDate, startDate, bookingDetail.quantity, bookingDetail.pricing);
            // !! delete the same not needed in current requirement.
            delete calculatedPrice.dailyPricing;
            delete calculatedPrice.yearlyPricing;

            calculatedPrice['totalPayable'] = bookingDetail.totalPayable;

            if (bookingDetail?.giftCardAmount > 0 && bookingDetail?.monthlyPayable) {
                // !! Calculate monthly pricing if giftCard is applied and booking is greater than 2 months
                const tempMonthlyPricing = await roundOffNumbers(calculatedPrice.totalPayable / bookingDetail?.bookingDuration?.months);
                // !! check if recurring model has data for the same if not insert it using the method.    
                let recurringDetail: any = await RecurringPayV1.findOne({ bookingId: Types.ObjectId(bookingDetail._id) });
                // !! assign calculated monthly payable for viewPlan api.
                bookingDetail['monthlyPayable'] = tempMonthlyPricing;
                if (!recurringDetail) {
                    await this.updateRecurringPayDetail(bookingDetail);
                }
                else {
                    calculatedPrice['monthlyPricing'] = (bookingDetail?.totalPayable - bookingDetail?.giftCardAmount) / bookingDetail?.bookingDuration?.months;
                }
                // !! assign calculatedPrice for selected criteria.
                calculatedPrice['totalPayable'] = bookingDetail?.totalPayable;
                bookingDetail?.giftCardAmount ? calculatedPrice['giftCardAmount'] = bookingDetail?.giftCardAmount : 0;
                bookingDetail?.offerPrice ? calculatedPrice['offerPrice'] = bookingDetail?.offerPrice : calculatedPrice.offerPrice = 0;
            } else {
                // !! checks if monthly plan is applicable or not.
                if (bookingDetail?.monthlyPayable) {
                    let recurringDetail = await RecurringPayV1.findOne({ bookingId: Types.ObjectId(bookingDetail._id) });
                    if (!recurringDetail) { await this.updateRecurringPayDetail(bookingDetail); }
                }
                bookingDetail?.offerPrice ? calculatedPrice.offerPrice = bookingDetail?.offerPrice : calculatedPrice.offerPrice = 0;
                calculatedPrice['monthlyPricing'] = bookingDetail?.monthlyPayable;
                calculatedPrice['totalPayable'] = bookingDetail?.totalPayable;
                bookingDetail?.giftCardAmount ? calculatedPrice['giftCardAmount'] = bookingDetail?.giftCardAmount : 0;
            }
            calculatedPrice.monthlyPricing <= 0 ? delete calculatedPrice.monthlyPricing : "";
            return calculatedPrice;
        } catch (error) {
            console.error(`we have an error ==> ${error}`);
        }
    }

    /**
     * @description update recurring plan in model for monthly payments
     * @param bookingDetail 
     */
    async updateRecurringPayDetail(bookingDetail: any) {
        try {
            let month = bookingDetail.fromDate.getMonth();
            let recurringData: any = [];
            for (let date = moment(bookingDetail.fromDate);
                date.isBefore(moment(bookingDetail.toDate).subtract(30, 'days'));
                date.add(30, 'days')) {
                let recurringMonthlyData = {
                    month: month,
                    bookingId: bookingDetail._id,
                    fromDate: bookingDetail.fromDate,
                    toDate: bookingDetail.toDate,
                    paymentDate: date.format(),
                    paymentStatus: date.format() == moment(bookingDetail.fromDate).format() ?
                        ENUM.PAYMENT.STATUS.SUCCESS :
                        ENUM.PAYMENT.STATUS.PENDING,
                    paymentPlan: ENUM.PAYMENT.PLAN.MONTHLY,
                    monthlyPayable: bookingDetail.monthlyPayable
                }
                recurringData.push(recurringMonthlyData);
                month++;
            }
            await RecurringPayV1.insertMany(recurringData);
        } catch (error) {
            console.error(`we have an error while inserting recurring detail ==> ${error}`);
        }
    }
    async fetchBookingSchedule(payload: any) {
        try {
            let pipeline: any = [];
            let matchCondition: any = {};
            let subCategoryArray: any = [];
            let categoryArray: any = [];

            pipeline.push(
                { $match: matchCondition },
                {
                    "$lookup": {
                        "from": "propertySpace",
                        "let": { "propertyId": "$propertyData.propertyId" },
                        "pipeline": [
                            {
                                '$match': {
                                    $and: [
                                        { $expr: { $eq: ['$_id', '$$propertyId'] } }
                                    ]
                                }
                            }
                        ],
                        "as": "categoryData"
                    }
                }
            )
            if (payload.categoryIds) {
                categoryArray = payload.categoryIds.split(",")
                for (let i = 0; i < categoryArray.length; i++) { categoryArray[i] = Types.ObjectId(categoryArray[i]) }
                pipeline.push({ 'categoryData.subCategory._id': { $in: subCategoryArray } })
            }
            if (payload.subCategoryIds) {
                subCategoryArray = payload.subCategoryIds.split(",")
                for (let i = 0; i < subCategoryArray.length; i++) { subCategoryArray[i] = Types.ObjectId(subCategoryArray[i]) }
                pipeline.push({ 'categoryData.subCategory._id': { $in: subCategoryArray } })
            }
            let response = await BookingV1.basicAggregate(pipeline);
            return response;
        } catch (error) {
            console.error(`we have an error ==> ${error}`);
            throw error;
        }
    }
    /**
     * @description to update calendar collection
     * @param cartData object with all booking details
     * @param bookingId newly generated bookingId : _id
     * @param toRemove true/false to remove calendar previous booking data while updating the new one
     */
    async updateCalendarSchedule(cartData: any, bookingId: string, toRemove?: boolean) {
        try {
            if (toRemove == true) await CalendarV1.removeAll({ "bookingDetails.bookingId": bookingId })

            const fromDateLimit = DATABASE.DATE_CONSTANTS.utcTimeDate(cartData.fromDate);
            const toDateLimit = DATABASE.DATE_CONSTANTS.utcTimeDate(cartData.toDate);

            // for now exclusive end date (full-open interval)
            for (let days = moment(fromDateLimit); days <= moment(toDateLimit); days.add(1, 'days')) {

                let dateToInsert = days.toISOString();

                CalendarV1.updateOne(
                    {
                        date: dateToInsert,
                        hostId: cartData.hostId,
                        propertyId: cartData.propertyData.propertyId
                    },
                    {
                        $push: {
                            "bookingDetails": {
                                subCategory: cartData.subCategory,
                                category: cartData.category,
                                bookingId: bookingId,
                                quantity: cartData.quantity,
                                bookingMode: cartData.bookingMode
                            }
                        },
                        $set: {
                            date: dateToInsert,
                            hostId: cartData.hostId,
                            propertyId: cartData.propertyData.propertyId,
                        }
                    },
                    {
                        upsert: true
                    })
            }
        } catch (error) {
            console.error(`we have an error while updating calendar data ==> ${error}`);
        }
    }

    async calendarFormatter(data: any[], date: any) {
        try {
            const payloadMonth = moment(date).month();
            const filteredArray = data.filter((element: any) => element._id.monthNumber === payloadMonth);
            return filteredArray;
        } catch (error) {
            console.error(`we have an error in calendarFormatter => ${error}`);
            throw error;
        }
    }

    async getPayoutData() {
        try {
            let pipeline: any = []
            pipeline.push(
                {
                    $match:
                    {
                        $and: [
                            {
                                createdAt:
                                    { $gte: new Date((new Date().getTime() - (15 * 24 * 60 * 60 * 1000))) }
                            },
                            { paymentStatus: ENUM.PAYMENT.STATUS.SUCCESS },
                            { bookingStatus: ENUM.BOOKING.STATUS.ACCEPTED }
                        ]
                    }

                },
                {
                    $project: {
                        _id: 1,
                        paymentStatus: 1,
                        bookingStatus: 1,
                        hostId: 1,
                        totalPayable: 1,
                        propertyData: 1
                    }
                }
            )
            const response = await BookingV1.basicAggregate(pipeline);
            return response;
        } catch (error) {
            console.error(`we have an error => ${error}`);
            throw error;
        }
    }
    async getBookingCount(payload: any) {
        let pipeline: any = [];
        let matchCriteria: any = []
        if (payload && payload.status) {
            matchCriteria.push({ 'bookingStatus': payload.status });
        } else {
            matchCriteria.push({ 'bookingStatus': { $eq: ENUM.BOOKING.STATUS.ONGOING } });
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
        return details.count;
    }

    async getTotalBookingCount(payload: any) {
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
        return details.count;
    }

    async fetchTotalRevenue(payload: any) {
        try {
            let pipeline: any = [];
            let matchCriteria: any = []
            const startOfMonth = moment().startOf('month').format('YYYY-MM-DD hh:mm');
            const endOfMonth = moment().endOf('month').format('YYYY-MM-DD hh:mm');
            if (!payload.fromDate && !payload.toDate) {
                matchCriteria.push({ createdAt: { $gte: new Date(startOfMonth) } })
                matchCriteria.push({ createdAt: { $lte: new Date(endOfMonth) } })

            }
            if (payload.fromDate) matchCriteria.push({ createdAt: { $gte: new Date(payload.fromDate) } });
            if (payload.toDate) matchCriteria.push({ createdAt: { $lte: new Date(payload.toDate) } });
            if (matchCriteria.length) pipeline.push({ $match: { $and: matchCriteria } });
            pipeline.push(
                {
                    '$match': {
                        $expr: {
                            $and: [
                                { $ne: ['$bookingStatus', ENUM.BOOKING.STATUS.CANCELLED] },
                                { $ne: ['$bookingStatus', ENUM.BOOKING.STATUS.ABANDONED] },
                                { $ne: ['$bookingStatus', ENUM.BOOKING.STATUS.REJECTED] },
                                { $ne: ['$bookingStatus', ENUM.BOOKING.STATUS.PENDING] }

                            ]
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalPayment: { $sum: "$totalPayable" }
                    }
                },
                { $project: { _id: 0, count: 1, totalPayment: 1 } }
            );
            let details: any = await BookingV1.basicAggregate(pipeline);
            details && details.length > 0 ? details = details[0] : details = { count: 0 }
            return details;
        } catch (error) {
            console.error(`we have an error while calculating total revenue ==> ${error}`);
        }
    }
    async cancellationCriteria(bookingDetails: any, numberOfDays: number): Promise<any> {
        try {
            if (bookingDetails.bookingStatus === ENUM.BOOKING.STATUS.ONGOING) {
                return ENUM.BOOKING.POLICY.CASE1;
            }
            else if (bookingDetails.bookingStatus === ENUM.BOOKING.STATUS.UPCOMING) {
                if (numberOfDays >= 14) {
                    return ENUM.BOOKING.POLICY.CASE2;
                }
                else if (numberOfDays == 13.9) {
                    return ENUM.BOOKING.POLICY.CASE3
                }
                else if (numberOfDays <= 13) {
                    return ENUM.BOOKING.POLICY.CASE6;
                }
                else {
                    return ENUM.BOOKING.POLICY.CASE4;
                }
            } else if (bookingDetails.bookingStatus === ENUM.BOOKING.STATUS.PENDING) {
                return ENUM.BOOKING.POLICY.CASE2;
            }
        } catch (error) {
            console.error(`we have an error ==> ${error}`);
        }
    }

}

export const BookingV1 = new BookingEntity(BookingModel);