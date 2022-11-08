// import joi from "joi";

// const userValidator = joi.object({
//   firstName: joi.string().min(3).max(25).required(),
//   lastName : joi.string().min(3).max(25).required(),
//   email: joi.string().email().trim().email(),
//   password: joi.string().min(2).max(32),
//   phoneNumber: joi.string().required(),

// });

// export default userValidator;

// /**
//  * @file common/validations
//  * @description exposes all the validation objects
//  * @created 2019-05-14 23:49:42
//  * @author Desk Now Dev Team
// */

// import { Joi } from "celebrate";
// import { ENUM_ARRAY, ENUM } from "./enum.common"
// import { CONSTANT } from "./constant.common";

// export const VALIDATION = {
//     ADMIN: {
//         ID: Joi.string().regex(/^[a-f\d]{24}$/i),
//         EMAIL: Joi.string().trim().email(),
//         PASSWORD: Joi.string().min(6).max(32),
//         NAME: Joi.string().trim().min(2).max(40),
//         PROFILE_PHOTO: Joi.string().trim().uri(),
//         META_TOKEN: Joi.string()
//     },
//     TAXES: {
//         LEVEL: Joi.number().valid(CONSTANT.ADMIN_TAXES_LEVEL.COUNTRY, CONSTANT.ADMIN_TAXES_LEVEL.STATE),
//         STATE: Joi.array().items({ id: Joi.string().regex(/^[a-f\d]{24}$/i), tax: Joi.number().min(0) })
//     },
//     ADMIN_HOST_LISTING: {
//         REG_START_DATE: Joi.date().iso(),
//         REG_END_DATE: Joi.date().iso(),
//         MIN_PROPERTY: Joi.number().min(0).max(1000),
//         MAX_PROPERTY: Joi.number().min(0).max(1000),
//     },
//     ADMIN_USER_LISTING: {
//         REG_START_DATE: Joi.date().iso(),
//         REG_END_DATE: Joi.date().iso(),
//         MIN_BOOKING: Joi.number(),
//         MAX_BOOKING: Joi.number(),
//         COMPANY_TYPE: Joi.string().valid(ENUM_ARRAY.USER.COMPANY_TYPE)
//     },
//     ADMIN_PROPERTY_LISTING: {
//         REG_START_DATE: Joi.string(),
//         REG_END_DATE: Joi.string(),
//         MIN_BOOKING: Joi.number(),
//         MAX_BOOKING: Joi.number(),
//     },

//     NOTIFICATION: {
//         ID: Joi.string().regex(/^[a-f\d]{24}$/i).required(),
//         ID_OPTIONAL: Joi.string().regex(/^[a-f\d]{24}$/i),
//     },

//     USER: {
//         NAME: Joi.string().min(3).max(40),
//         EMAIL: Joi.string().trim().email().max(100),
//         PASSWORD: Joi.string().min(8).max(20),
//         COUNTRY_CODE: Joi.string(),
//         PHONE: Joi.string().min(8).max(15),
//         DOB: Joi.string(),
//         address: Joi.string(),
//         IMAGE: Joi.string().allow("", null),
//         COMPANY_TYPE: Joi.string().valid(ENUM_ARRAY.USER.COMPANY_TYPE),
//         OTP: Joi.string(),
//         DEVICE: Joi.object().keys({
//             type: Joi.number(), //0: android ,1 : Ios, 2: web
//             token: Joi.string().allow('')
//         }),
//         RESET_TOKEN: Joi.string(),
//         SOCIAL_LOGIN_TYPE: Joi.string().required().valid(ENUM_ARRAY.SOCIAL_LOGIN_TYPE.PLATFORM),
//         SOCIAL_ID: Joi.string().required(),
//         STATUS: Joi.string(),
//         ACCOUNT_STATUS: Joi.string(),
//         SORT: Joi.string().valid(ENUM_ARRAY.SORT_BY),
//         ID: Joi.string().regex(/^[a-f\d]{24}$/i),
//         TYPE: Joi.string().optional().valid(ENUM_ARRAY.USER.TYPE),
//         USER_TYPE: Joi.number().optional().valid(ENUM_ARRAY.USER.TYPE),
//         DEEP_LINK_TYPE: Joi.number().optional().valid(ENUM_ARRAY.USER.DEEP_LINK_TYPE),
//         CITY: Joi.string().allow(null, ""),
//         BIO: Joi.string().allow(null, "").optional().max(450),
//         GENDER: Joi.string().optional().valid(ENUM_ARRAY.USER.GENDER),
//         LATITUDE: Joi.number().min(-90).max(90),
//         LONGITUDE: Joi.number().min(-180).max(180),
//         COUNTRYID: Joi.string(),
//         STATE_ID: Joi.string(),
//         KEYWORD: Joi.string(),
//         CATEGORY: Joi.array().items(Joi.string()).allow(null, ""),
//         fromDate: Joi.date().iso(),
//         toDate: Joi.date().iso(),
//         COWORKER_EMAILS: Joi.array().items(Joi.string().email()),
//         COHOST_TYPE: Joi.number().required().valid(0, 1, 2),
//         COHOST_DETAILS_TYPE: Joi.number().required().valid(0, 1)// 0 for edit 1 for all
//     },

//     FAQ: {
//         QUESTION: Joi.string().required(),
//         ANSWER: Joi.string(),
//         LANG: Joi.string(),
//         USERTYPE: Joi.number().required(), //1 user //2 host
//         SORT_ORDER: Joi.number().valid(CONSTANT.FAQ_SORT_ORDER_ACTION.ANSWER, CONSTANT.FAQ_SORT_ORDER_ACTION.QUESTION),
//         TYPE: Joi.number().required().valid(CONSTANT.FAQ_ACTION.ACTIVE, CONSTANT.FAQ_ACTION.INACTIVE),
//     },
//     TNC: {
//         CONTENT: Joi.string(),
//         TITLE: Joi.string(),
//         LANG: Joi.string(),
//         EDIT_TYPE: Joi.number().valid(CONSTANT.TANDC_EDITOR.EDITOR,
//             CONSTANT.TANDC_EDITOR.EDIT_HTML,
//         ),
//         TYPE: Joi.number().required().valid(
//             CONSTANT.TANDC.TERMSANDCONDITION,
//             CONSTANT.TANDC.PRIVACYPOLICY,
//             CONSTANT.TANDC.ABOUTUS,
//             CONSTANT.TANDC.FAQ,
//             CONSTANT.TANDC.STORY,
//             CONSTANT.TANDC.TEAM,
//             ENUM.ADMIN.CONTENT_TYPE.REFUND_POLICY,
//             ENUM.ADMIN.CONTENT_TYPE.PAYMENT_POLICY,
//         )
//     },

//     HOST_COMPANY_DETAILS: {
//         NAME: Joi.string().min(2).max(80),
//         EMAIL: Joi.string().trim().email().max(100),
//         PROFILE_PICTURE: Joi.string().allow("", null),
//         COUNTRY_CODE: Joi.string(),
//         STREET: Joi.string().allow(null, "").min(3).max(100).error(errors => {
//             errors.forEach(err => {
//                 switch (err.type) {
//                     case "string.min":
//                         err.message = `AddressLine2 length must be atleast 3 characters long`;
//                         break;
//                     case "string.max":
//                         err.message = `AddressLine2 length must be less than 100 characters`;
//                         break;
//                     default:
//                         break;
//                 }
//             });
//             return errors;
//         }),
//         LANDMARK: Joi.string().min(2).max(140),
//         COUNTRY: Joi.string(),
//         REGISTRATION_NUMBER: Joi.string().min(2).max(40).allow(null, ""),
//         ZIP_CODE: Joi.string().min(4).max(12),
//         HOUSE_NUMBER: Joi.string().allow(null, "").min(3).max(100).error(errors => {
//             errors.forEach(err => {
//                 switch (err.type) {
//                     case "string.min":
//                         err.message = `AddressLine1 length must be atleast 3 characters long`;
//                         break;
//                     case "string.max":
//                         err.message = `AddressLine1 length must be less than 100 characters`;
//                         break;
//                     default:
//                         break;
//                 }
//             });
//             return errors;
//         }),
//         PHONE: Joi.string().min(8).max(14),
//         IMAGE: Joi.string().allow("", null),
//         COMPANY_TYPE: Joi.string().valid(ENUM_ARRAY.USER.COMPANY_TYPE),
//         SORT: Joi.string().valid(ENUM_ARRAY.SORT_BY),
//         ID: Joi.string().regex(/^[a-f\d]{24}$/i),
//         CITY: Joi.string().allow(null, ""),
//         STATE: Joi.string().allow(null, ""),
//         TAX_NUMBER: Joi.string().min(2).max(40).allow(null, ""),
//         LATITUDE: Joi.number().min(-90).max(90),
//         LONGITUDE: Joi.number().min(-180).max(180),
//         DOCUMENT: Joi.array().items(Joi.string()).allow(null, ""),
//         STATE_ID: Joi.number(),
//         COUNTRY_ID: Joi.number(),
//         tnc: Joi.boolean().valid(true, false)
//     },

//     PROPERTY: {
//         STATE_ID: Joi.number(),
//         NAME: Joi.string().min(3).max(40).trim(),
//         FAVOURITE_ACTION: Joi.number().valid(CONSTANT.FAV_ACTION.ADD, CONSTANT.FAV_ACTION.REMOVE),
//         USER_TYPE: Joi.number().valid(CONSTANT.PROPERTY_USER_TYPE.USER, CONSTANT.PROPERTY_USER_TYPE.EMPLOYEE),
//         FAV_BOOKING_STATUS: Joi.number().valid(CONSTANT.FAV_BOOKING_ACTION.NEVER, CONSTANT.FAV_BOOKING_ACTION.PREVIOUS),
//         BOOKING_STATUS: Joi.number().valid(CONSTANT.BOOKING.STATUS.ACCEPTED, CONSTANT.BOOKING.STATUS.REJECTED, CONSTANT.BOOKING.STATUS.ABANDONED, CONSTANT.BOOKING.STATUS.CANCELLED, CONSTANT.BOOKING.STATUS.COMPLETED, CONSTANT.BOOKING.STATUS.ONGOING),
//         BOOKING_MODE: Joi.number().valid(ENUM.BOOKING_MODE.STATUS.OFFLINE, ENUM.BOOKING_MODE.STATUS.ONLINE),
//         BOOKING_TYPE: Joi.number().valid(ENUM.USER.BOOKING_TYPE.HOURLY, ENUM.USER.BOOKING_TYPE.MONTHLY, ENUM.USER.BOOKING_TYPE.CUSTOM, ENUM.USER.BOOKING_TYPE.EMPLOYEE),
//         PARTNER_BOOKING_TYPE: Joi.number().valid(ENUM.USER.BOOKING_TYPE.HOURLY, ENUM.USER.BOOKING_TYPE.MONTHLY, ENUM.USER.BOOKING_TYPE.CUSTOM),
//         BOOKING_REQUEST: Joi.number().valid(
//             CONSTANT.BOOKING.REQUEST, //0
//             CONSTANT.BOOKING.ACCEPTED,//1
//             CONSTANT.BOOKING.REJECTED,//2
//             CONSTANT.BOOKING.OFFLINE, //3
//             CONSTANT.BOOKING.HISTORY,//4
//             CONSTANT.BOOKING.UPCOMING, //6
//             CONSTANT.BOOKING.ONGOING, //7
//             CONSTANT.BOOKING.ALL//8
//         ),

//         FLOOR_DETAILS: Joi.array()
//             .items({
//                 subCategory: Joi.object({
//                     _id: Joi.string().regex(/^[a-f\d]{24}$/i).trim(),
//                     name: Joi.string().trim(),
//                     description: Joi.string().allow(null, '').trim(),
//                     iconImage: Joi.string().allow(null, '').trim().optional(),
//                     parentId: Joi.string().regex(/^[a-f\d]{24}$/i).trim()
//                 }),
//                 category: Joi.object({
//                     _id: Joi.string().regex(/^[a-f\d]{24}$/i).trim(),
//                     name: Joi.string().trim(),
//                     description: Joi.string().allow(null, '').trim(),
//                     iconImage: Joi.string().allow(null, '').trim().optional(),
//                     colorCode: Joi.string().trim(),
//                     options: Joi.array().allow(null, ''),
//                 }),
//                 floorNumber: Joi.number(),
//                 floorLabel: Joi.string().allow(null, '').trim(),
//                 floorDescription: Joi.string().allow(null, '').trim(),
//                 capacity: Joi.number(),
//                 units: Joi.number().required(),
//                 isEmployee: Joi.boolean().required(),
//                 bookingType: Joi.number().valid(ENUM_ARRAY.USER_BOOKING_TYPE.BOOKING_TYPE).required(),
//                 position: Joi.object({
//                     x: Joi.number().required(),
//                     y: Joi.number().required()
//                 }),
//                 gridRow: Joi.number().min(0).required(),
//                 gridColumn: Joi.number().min(0).required(),
//                 floorImage: Joi.string().required(),
//                 spaceLabel: Joi.string().allow('').trim(),
//                 pricing: Joi.object({
//                     daily: Joi.number(),
//                     monthly: Joi.number(),
//                     hourly: Joi.number(),
//                 }),
//                 offerPrice: Joi.array().items({
//                     selectedMaxValue: Joi.any(),
//                     selectedMinValue: Joi.any(),
//                     seasonName: Joi.string().required(),
//                     startDate: Joi.date().required(),
//                     endDate: Joi.date().required(),
//                     priceDetails: Joi.array().items({
//                         discountLabelType: Joi.number().valid([
//                             ENUM.PROPERTY.OFFER.DISCOUNT_LABEL_TYPE.ADVANCE_BOOKING_DURATION,
//                             ENUM.PROPERTY.OFFER.DISCOUNT_LABEL_TYPE.BOOKING_DURATION,
//                             ENUM.PROPERTY.OFFER.DISCOUNT_LABEL_TYPE.UNITS
//                         ]).required(),
//                         months: Joi.number(),
//                         days: Joi.number(),
//                         discountPercentage: Joi.number(),
//                         minUnits: Joi.number(),
//                         maxUnits: Joi.number(),
//                     }),
//                     priceRange: Joi.object({
//                         dailyPrice: Joi.object({
//                             min: Joi.number().required(),
//                             max: Joi.number().required(),
//                         }).required(),
//                         monthlyPrice: Joi.object({
//                             min: Joi.number().required(),
//                             max: Joi.number().required(),
//                         }).required(),
//                         hourlyPrice: Joi.object({
//                             min: Joi.number().required(),
//                             max: Joi.number().required(),
//                         }).required()
//                     })
//                 }).allow([]),
//                 isOfferPrice: Joi.number().valid([
//                     ENUM.IS_OFFER_PRICE.TRUE,
//                     ENUM.IS_OFFER_PRICE.FALSE
//                 ])
//             }),

//         PARTNER_FLOOR_DETAILS: Joi.array()
//             .items({
//                 spaceId: Joi.string().regex(/^[a-f\d]{24}$/i),
//                 // employeeUnits: Joi.number()
//             }),

//         EDITABLE_FLOOR_DETAILS: Joi.array()
//             .items({
//                 floorId: Joi.string().regex(/^[a-f\d]{24}$/i),
//                 floorDescription: Joi.string().trim(),
//                 subCategory: Joi.object({
//                     _id: Joi.string().regex(/^[a-f\d]{24}$/i).trim(),
//                     name: Joi.string().trim(),
//                     description: Joi.string().allow(null, '').trim(),
//                     iconImage: Joi.string().allow(null, '').trim(),
//                     parentId: Joi.string().regex(/^[a-f\d]{24}$/i).trim()
//                 }).required(),
//                 category: Joi.object({
//                     _id: Joi.string().regex(/^[a-f\d]{24}$/i).trim(),
//                     name: Joi.string().trim(),
//                     description: Joi.string().allow(null, '').trim(),
//                     iconImage: Joi.string().allow(null, '').trim(),
//                     colorCode: Joi.string().trim(),
//                     options: Joi.array().allow(null, ''),
//                 }).required(),
//                 floorNumber: Joi.number(),
//                 floorLabel: Joi.string().allow(null, ''),
//                 capacity: Joi.number(),
//                 units: Joi.number().required(),
//                 isEmployee: Joi.boolean().required(),
//                 bookingType: Joi.number().valid(ENUM_ARRAY.USER_BOOKING_TYPE.BOOKING_TYPE).required(),
//                 position: Joi.object({
//                     x: Joi.number().required(),
//                     y: Joi.number().required()
//                 }).required(),
//                 gridRow: Joi.number().min(0).required(),
//                 gridColumn: Joi.number().min(0).required(),
//                 floorImage: Joi.string().required(),
//                 spaceLabel: Joi.string().allow('').trim(),
//                 pricing: Joi.object({
//                     daily: Joi.number(),
//                     monthly: Joi.number(),
//                     hourly: Joi.number(),
//                 }).required(),
//                 offerPrice: Joi.array().items({
//                     selectedMaxValue: Joi.any(),
//                     selectedMinValue: Joi.any(),
//                     seasonName: Joi.string().required().trim(),
//                     startDate: Joi.date().required(),
//                     endDate: Joi.date().required(),
//                     priceDetails: Joi.array().items({
//                         discountLabelType: Joi.number().valid([
//                             ENUM.PROPERTY.OFFER.DISCOUNT_LABEL_TYPE.ADVANCE_BOOKING_DURATION,
//                             ENUM.PROPERTY.OFFER.DISCOUNT_LABEL_TYPE.BOOKING_DURATION,
//                             ENUM.PROPERTY.OFFER.DISCOUNT_LABEL_TYPE.UNITS
//                         ]).required(),
//                         months: Joi.number(),
//                         days: Joi.number(),
//                         discountPercentage: Joi.number(),
//                         minUnits: Joi.number(),
//                         maxUnits: Joi.number(),
//                     }),
//                     priceRange: Joi.object({
//                         dailyPrice: Joi.object({
//                             min: Joi.number().required(),
//                             max: Joi.number().required(),
//                         }).required(),
//                         monthlyPrice: Joi.object({
//                             min: Joi.number().required(),
//                             max: Joi.number().required(),
//                         }).required(),
//                         hourlyPrice: Joi.object({
//                             min: Joi.number().required(),
//                             max: Joi.number().required(),
//                         }).required()
//                     })
//                 }).allow([]),
//                 isOfferPrice: Joi.number().valid([
//                     ENUM.IS_OFFER_PRICE.TRUE,
//                     ENUM.IS_OFFER_PRICE.FALSE
//                 ])
//             }),
//         BOOKING_SORTKEY: Joi.any(),
//         BOOKING_REQUEST_TYPE: Joi.number().valid(CONSTANT.BOOKING_REQUEST_STATUS.ACCEPT, CONSTANT.BOOKING_REQUEST_STATUS.REJECT),
//         STREET: Joi.string().allow(null, "").min(3).max(100).error(errors => {
//             errors.forEach(err => {
//                 switch (err.type) {
//                     case "string.min":
//                         err.message = `AddressLine2 length must be atleast 3 characters long`;
//                         break;
//                     case "string.max":
//                         err.message = `AddressLine2 length must be less than 100 characters`;
//                         break;
//                     default:
//                         break;
//                 }
//             });
//             return errors;
//         }),
//         STATUS: Joi.string().valid(ENUM.PROPERTY.STATUS.ACTIVE, ENUM.PROPERTY.STATUS.INACTIVE),
//         PROPERTY_DRAFT_STATUS: Joi.string().valid(ENUM.PROPERTY.STATUS.ACTIVE, ENUM.PROPERTY.STATUS.DRAFT),
//         TO_BE_PUBLISHED: Joi.string().valid(true, false),
//         LANDMARK: Joi.string(),
//         COUNTRY: Joi.string(),
//         ZIP_CODE: Joi.string().min(4).max(12),
//         HOUSE_NUMBER: Joi.string().min(3).max(100).required(),
//         ADDRESS_PRIMARY: Joi.string().min(3).max(100),
//         ADDRESS_SECONDARY: Joi.string().min(3).max(100).allow(null, ''),
//         LANE1: Joi.string().min(3).max(100).error(errors => {
//             errors.forEach(err => {
//                 switch (err.type) {
//                     case "string.min":
//                         err.message = `Lane1 length must be atleast 3 characters long`;
//                         break;
//                     case "any.required":
//                         err.message = "Lane1 is required!";
//                         break;
//                     case "string.max":
//                         err.message = `Lane1 length must be less than 100 characters`;
//                         break;
//                     default:
//                         break;
//                 }
//             });
//             return errors;
//         }),
//         LANE2: Joi.string().min(3).max(100).error(errors => {
//             errors.forEach(err => {
//                 switch (err.type) {
//                     case "string.min":
//                         err.message = `Lane2 length must be atleast 3 characters long`;
//                         break;
//                     case "any.required":
//                         err.message = "Lane2 is required!";
//                         break;
//                     case "string.max":
//                         err.message = `Lane2 length must be less than 100 characters`;
//                         break;
//                     default:
//                         break;
//                 }
//             });
//             return errors;
//         }),
//         IMAGES: Joi.array().items(Joi.string()).allow(null, ""),
//         HEADING: Joi.string(),
//         DOCS: Joi.array().items(Joi.object({
//             url: Joi.string().required(),
//             name: Joi.string().required(),
//             type: Joi.string().required()
//         })),
//         floorCorners : Joi.array()
//         .items(Joi.object({
//             floorNumber : Joi.number().required(),
//             cornerLabels : Joi.array().items(Joi.object({
//                 floorKey : Joi.string().required(),
//                 floorLabel : Joi.string().allow(null, "").required()
//             }))
//         })
//         ),
//         DESCRIPTION: Joi.string().allow(null, ""),
//         BUILT_UP_AREA: Joi.number(),
//         FLOOR: Joi.number(),
//         PROPERTY_TYPE: Joi.number().valid(
//             ENUM.PROPERTY.PROPERTY_TYPE.ENTIRE_BUILDING,
//             ENUM.PROPERTY.PROPERTY_TYPE.SPECIFIC_FLOOR),
//         AUTO_ACCEPT_BOOKING: Joi.boolean().valid(true, false),
//         UPCOMING_BOOKING: Joi.boolean().valid(true, false),
//         CITY: Joi.string().allow(null, ""),
//         TAGS: Joi.array().items(Joi.string()).allow(null, ""),
//         STATE: Joi.string().allow(null, ""),
//         SEARCH: Joi.string(),
//         ID: Joi.string().regex(/^[a-f\d]{24}$/i),
//         AMENITIES: Joi.array().items(Joi.object({
//             amenityId: Joi.string().regex(/^[a-f\d]{24}$/i),
//             name: Joi.string().required(),
//             iconImage: Joi.string().required(),
//             type: Joi.string().required(),
//             status: Joi.string(),
//             _id: Joi.string().regex(/^[a-f\d]{24}$/i),
//             isFeatured: Joi.number()
//         })),
//         STATE_OBJ: Joi.any(),
//         COUNTRY_OBJ: Joi.any(),
//         CITY_OBJ: Joi.any(),
//         COUNTRY_ID: Joi.number(),
//         LOCATION: Joi.object().keys({
//             coordinates: Joi.array().ordered(...[
//                 Joi.number().min(-180).max(180).required().error(Error(`Valid longitude values are between -180 and 180, both inclusive`)),
//                 Joi.number().min(-90).max(90).required().error(Error(`Valid latitude values are between -90 and 90, both inclusive.`))
//             ]).description("first Parameter Longitude, second latitude").length(2)
//         }),
//         EDITABLE_LOCATION: Joi.object().keys({
//             coordinates: Joi.array().ordered(...[
//                 Joi.number().min(-180).max(180).required().error(Error(`Valid longitude values are between -180 and 180, both inclusive`)),
//                 Joi.number().min(-90).max(90).required().error(Error(`Valid latitude values are between -90 and 90, both inclusive.`))
//             ]).description("first Parameter Longitude, second latitude").length(2)
//         }).required(),
//         PROPERTY_IDS: Joi.array().items(Joi.string()).allow(null, ""),
//         CATEGORY_ID: Joi.any(),
//         CITY_ID: Joi.any(),
//         AMENITIES_ID: Joi.string().allow("", null),
//         fromDate: Joi.date().iso(),
//         toDate: Joi.date().iso(),
//         type: Joi.string().required().valid('activate', 'active', 'inactive', 'isDelete', 'archive'),
//         partnerType: Joi.string().required().valid('active', 'inactive', 'delete'),
//         PROPERTYID: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
//     },

//     BOOKING: {
//         SORT_KEY: Joi.number().valid(CONSTANT.BOOKING_HOST_SORT.AUTO, CONSTANT.BOOKING_HOST_SORT.MANUAL, CONSTANT.BOOKING_HOST_SORT.ALL),
//         Type: Joi.number().valid(0, 1), // 0 for all 1 for abonded checkout eq to 0
//         BOOKING_TYPE: Joi.number().valid(ENUM_ARRAY.USER_BOOKING_TYPE.BOOKING_TYPE).required(),
//         ADMIN_BOOKING_TYPE: Joi.number().valid(ENUM_ARRAY.USER_BOOKING_TYPE.BOOKING_TYPE)
//     },

//     PAYMENT: {
//         type: Joi.number().valid(CONSTANT.PAYMENT_TYPE.PENDING, CONSTANT.PAYMENT_TYPE.SETTLED, CONSTANT.PAYMENT_TYPE.TOTAL),

//     },

//     PROPERTY_SPACES: {
//         IS_OFFER_PRICE: Joi.number().valid([
//             ENUM.IS_OFFER_PRICE.TRUE,
//             ENUM.IS_OFFER_PRICE.FALSE
//         ]),
//         spaceId: Joi.string(),
//         images: Joi.array().items(Joi.string()).allow(null, ""),
//         isDelete: Joi.boolean(),
//         capacity: Joi.number(),
//         units: Joi.number(),
//         dailyPrice: Joi.number(),
//         monthlyPrice: Joi.number(),
//         yearlyPrice: Joi.number(),
//         hourlyPrice: Joi.number(),
//         ID: Joi.string().regex(/^[a-f\d]{24}$/i).required(),
//         CATEGORY_ID: Joi.string().regex(/^[a-f\d]{24}$/i),
//         SUBCATEGORY_ID: Joi.string().regex(/^[a-f\d]{24}$/i),
//         OFFER_PRICE: Joi.array().items({
//             selectedMaxValue: Joi.number(),
//             selectedMinValue: Joi.number(),
//             seasonName: Joi.string().required(),
//             startDate: Joi.date().required(),
//             endDate: Joi.date().required(),
//             priceDetails: Joi.array().items({
//                 discountLabelType: Joi.number().valid([
//                     ENUM.PROPERTY.OFFER.DISCOUNT_LABEL_TYPE.ADVANCE_BOOKING_DURATION,
//                     ENUM.PROPERTY.OFFER.DISCOUNT_LABEL_TYPE.BOOKING_DURATION,
//                     ENUM.PROPERTY.OFFER.DISCOUNT_LABEL_TYPE.UNITS
//                 ]).required(),
//                 months: Joi.number(),
//                 days: Joi.number(),
//                 discountPercentage: Joi.number(),
//                 minUnits: Joi.number(),
//                 maxUnits: Joi.number(),
//             }),
//             priceRange: Joi.object({
//                 dailyPrice: Joi.object({
//                     min: Joi.number().required(),
//                     max: Joi.number().required(),
//                 }).required(),
//                 monthlyPrice: Joi.object({
//                     min: Joi.number().required(),
//                     max: Joi.number().required(),
//                 }).required(),
//                 yearlyPrice: Joi.object({
//                     min: Joi.number().required(),
//                     max: Joi.number().required(),
//                 }).required()
//             })
//         }).allow([]),
//     },
//     AMENITIES: {
//         ID: Joi.string().regex(/^[a-f\d]{24}$/i).required(),
//         NAME: Joi.string().min(2).max(50),
//         TYPE: Joi.string().min(2).max(50),
//         icon_image: Joi.string(),
//     },
//     CATEGORY: {
//         ID: Joi.string().regex(/^[a-f\d]{24}$/i).required(),
//         PARENT_ID: Joi.string().regex(/^[a-f\d]{24}$/i),
//         NAME: Joi.string().min(3).max(50),
//         icon_image: Joi.string(),
//         OPTION: Joi.array(),
//     },
//     CITY: {
//         ID: Joi.string().regex(/^[a-f\d]{24}$/i),
//         COUNTRY_ID: Joi.number().min(1),
//         STATE_ID: Joi.number().min(1),
//         CITY_NAME: Joi.string().min(3).max(50),
//         ICONE_IMAGE: Joi.string(),
//         ZIP_CODES: Joi.array().items(Joi.string())
//     },
//     HISTORY: {
//         SEARCH_TYPE: Joi.string().required().valid('event', 'user'),
//         ID: Joi.string().regex(/^[a-f\d]{24}$/i),
//     },
//     GENERAL: {
//         ID: Joi.string().regex(/^[a-f\d]{24}$/i),
//         ANY: Joi.any(),
//         BOOLEAN: Joi.boolean(),
//         STRING: Joi.string(),
//         PAGINATION: {
//             page: Joi.number().min(1).required(),
//             limit: Joi.number().min(3).max(100).default(10).optional(),
//             search: Joi.string().trim().optional(),
//         },
//         OBJECT: Joi.object(),
//         DATE: Joi.date().iso(),
//         NUMBER: Joi.number(),
//         BOOKING_STATUS: Joi.number().valid(ENUM_ARRAY.BOOKING.STATUS),
//         PAYMENT_STATUS: Joi.number().valid(ENUM_ARRAY.PAYMENT.STATUS),
//         REF: (key: string) => Joi.ref(key),
//         ARRAY_OF_IDS: Joi.any(),
//         ARRAY_OF_NUMBERS: Joi.array().items(Joi.number()),
//     },

//     FILTER: {
//         KEY: Joi.array().items(Joi.string().valid(ENUM_ARRAY.FILTERBY.KEYS))
//     },
//     SORT: {
//         ADMIN_USER_LISTING: Joi.string().valid(ENUM_ARRAY.SORT_BY.ADMIN_USER_LISTING),
//         ADMIN_HOST_LISTING: Joi.number().valid(ENUM_ARRAY.SORT_BY.ADMIN_BOOKING_LISTING),
//         ADMIN_FAQ_LISTING: Joi.number(),
//         ADMIN_BOOKING_LISTING: Joi.string().valid(ENUM_ARRAY.SORT_BY.ADMIN_BOOKING_LISTING),
//         KEY: Joi.string().valid(ENUM_ARRAY.SORT_BY.KEYS),
//         SORT_ORDER: Joi.number().valid(ENUM_ARRAY.SORT_BY.ASENDING_DESCENDING),
//         PAYOUT_LISTING: Joi.string().valid(ENUM_ARRAY.SORT_BY.KEYS),
//     },
//     GENERAL_MONGO_ID: Joi.string().regex(/^[0-9a-fA-F]{24}$/)
// }
