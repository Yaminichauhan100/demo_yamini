
/**
 * @name enum.common
 * @description defines enum values 
 * @created 2019-05-07 21:24:20
 * @author Desk Now Dev Team
*/

export const ENUM = {
    LOGIN_TYPE: {
        FACEBOOK: "facebook",
        LINKEDIN: "linkedin",
        APPLE: "apple"
    },
    UPLOAD_DIR_PDF: process.cwd() + "/public/",
    COMMON_LOGS_TYPE: {
        PROPERTY_CRON: 1
    },
    NOTIFICATION_TYPE: {
        ACCEPT_REJECT_REQUEST: 1,
        BOOK_PROPERTY: 2,
        CANCEL_BOOK_PROPERTY: 3,
        ADMIN_BULK: 4,
        BOOKING_SUCCESS_USER: 5,
        BOOKING_CONFIRMED_USER: 6,
        BOOKING_REJECTED_USER: 7,
        BOOKING_SUCCESS_HOST: 8,
        BOOKING_REQUEST_HOST: 9,
        BOOKING_REQUEST_USER: 10,
        BOOKING_REQUEST_ACCEPTED_HOST: 11,
        BOOKING_REQUEST_ACCEPTED_USER: 12,
        BOOKING_REQUEST_REJECTED_HOST: 18,
        BOOKING_REQUEST_REJECTED_USER: 19,
        BOOKING_CANCELLED_USER: 13,
        BOOKING_CANCELLED_HOST: 14,
        USER_PB_VERIFICATION_SUCCESS: 15,
        USER_PB_VERIFICATION_FALSE: 17,
        SCHEDULED_DEMO: 20
    },
    ADMIN: {
        TYPE: { SUPER_ADMIN: 'super', SUB_ADMIN: 'sub' },
        SUBJECT_TYPE: {
            USER_SPECIFIC: 1,
            PLATFORM_SPECIFIC: 2
        },
        DEVICE_PLATFORM: { WEB: 'web' },
        VALUE: 'ADMIN',
        LOOKUP_TYPE: {
            HOST_EMAIL_IDS: 0,
            USER_EMAIL_IDS: 1,
            HOST_CONTACT_NUMBER: 2,
            USER_CONTACT_NUMBER: 3
        },
        NOTIFICATION: {
            RECIEVER: {
                ALL: 0,
                APP: 1,
                WEB: 2,
                HOSTS: 3,
                USERS: 4,
                OTHER: 5
            }
        },
        CONTENT_TYPE: {
            REFUND_POLICY: 8,
            PAYMENT_POLICY: 9
        }
    },
    USER: {
        PROFILE_STATUS: { BEGINNER: 1, INTERMEDIATE: 2, ADVANCED: 3 },
        DEFAULT_IMAGE: "https://appinventiv-development.s3.amazonaws.com/u_placeholder.jpeg",
        STATUS: { ACTIVE: 'active', BLOCK: 'blocked', ISDELETE: 'isDelete', INACTIVE: 'inactive', DELETE: 'delete' },
        TYPE: { USER: 1, HOST: 2 },
        DEEP_LINK_TYPE: { USER: 1, HOST: 2, EMPLOYEE: 3 },
        GENDER: { MALE: 'male', FEMALE: 'female', OTHER: 'other' },
        COMPANY_TYPE: { COMPANY: 'company', INDIVIDUAL: 'individual' },
        ACCOUNT_STATUS: { VERIFIED: 'verified', UNVERIFIED: 'unverified' },
        DEVICE_TYPE: [0, 1, 2],// 0: ANDROID, 1: IOS 2: WEB
        SUB_COMPANY_TYPE: { COMPANY: 0, FREELANCER: 1 },
        CALENDAR_TYPE: {
            OUTLOOK: 1,
            GOOGLE: 2
        },
        CALENDAR_UPDATE_STATUS: {
            KEEP: 1,
            REMOVE: 2
        },
        INIVITATION_STATUS: {
            ACCEPTED: 1,
            PENDING: 0,
            CANCEL: 2
        },
        BOOKING_TYPE: {
            HOURLY: 1,
            MONTHLY: 2,
            CUSTOM: 3,
            EMPLOYEE: 4
        }
    },
    BOOLEAN: {
        TRUE: true,
        FALSE: false
    },
    FAQ: {
        TYPE: { ACTIVE: 1, INACTIVE: 2 },
    },
    ADVERTISEMENT: {
        ListingPlacement: { HOME: 0, LISTING: 1 },
    },
    CONFIG: {
        TYPE: { AMOUNT: 0 }
    },
    RESOLUTION_STATUS: {
        STATUS: { PENDING: 0, RESOLVED: 1 }
    },
    BOOKING: {
        STATUS: { ONGOING: 0, COMPLETED: 1, CANCELLED: 2, UPCOMING: 3, REJECTED: 4, ABANDONED: 5, ACCEPTED: 6, PENDING: 7 },
        PROLONGED_STATUS: { PENDING: 0, SUCCESS: 1 },
        COWORKERS: {
            SORT_BY: {
                NAME: 0,
                RECENTLY_ADDED: 1
            }
        },
        GIFT_CARD_STATUS: {
            QUEUED: 0,
            APPLIED: 1,
            REMOVED: 2
        },
        SCHEDULE_TYPE: {
            BOOKING: 0,
            HOLIDAY: 1
        },
        POLICY: {
            CASE1: {
                PERCENT_AMOUNT: 0,
                CANCELLATION_POLICY: `There will be no refund after check-in/booking becomes an ongoing booking.`
            },
            CASE2: {
                PERCENT_AMOUNT: 100,
                CANCELLATION_POLICY: `Users can cancel a booking 14 days prior to the check-in date.`
            },
            CASE3: {
                PERCENT_AMOUNT: 100,
                CANCELLATION_POLICY: `If the difference between the date of booking creation and check-in date is less then 14 days then the user will get only 1 hour to cancel the booking.`
            },
            CASE4: {
                PERCENT_AMOUNT: 0,
                CANCELLATION_POLICY: `Same day booking can't be canceled.`
            },
            CASE5: {
                PERCENT_AMOUNT: 0,
                CANCELLATION_POLICY: `If a booking is not been accepted by the host, it can be canceled anytime.`
            },
            CASE6: {
                PERCENT_AMOUNT: 0,
                CANCELLATION_POLICY: `Checkin date is less than 14.`
            },
            TYPE: {
                DAYS: 0,
                HOURS: 1
            }
        }
    },
    GIFT_CARD: {
        REDEMPTION_STATUS: {
            NOT_REDEEMED: 0,
            PARTIALLY_REDEEMED: 1,
            FULLY_REDEEMED: 2
        }
    },
    APPS: {
        FACEBOOK: 0,
        LINKEDIN: 1,
        YOUTUBE: 2,
        TWITTER: 3,
        INSTAGRAM: 4,
        GOOGLE_CALENDAR: 5,
        OUTLOOK_CALENDAR: 6
    },
    USER_BOOKING_STATUS: { STATUS: { PENDING: 0, CONFIRMED: 1, CANCELLED: 2, COMPLETED: 3, ONGOING: 4 } },
    BOOKING_TYPE: {
        REQUEST: 0,
        HISTORY: 1,
        TYPE: { ONLINE: 0, OFFLINE: 1, ALL: 2 }
    },

    BOOKING_MODE: {
        STATUS: { ONLINE: 0, OFFLINE: 1 }
    },
    PAYMENT: {
        STATUS: { PENDING: 0, SUCCESS: 1, FAILURE: 2, CANCELLED: 4 },
        PLAN: { DAILY: 0, MONTHLY: 1, YEARLY: 2, COMPLETE: 3 },
        ACTION: { RECEIVED: 0, DEBITED: 1 }
    },
    ACCESS_RIGHTS: { READ: 0, ADD: 1, EDIT: 2 },
    COHOST_PERMISSION: {
        STATUS: { CLIENT: 0, BOOKINGS: 1, PAYMENTS: 2, PROPERTY: 3, REVIEWS: 4 },
        TYPE: { ACTIVE: 0, INACTIVE: 1, ARCHIVE: 2 }
    },
    COHOST_LEVEL: {
        REGION: 1, PROPERTY: 2, ALL: 3,
        STATUS: { COUNTRY: 1, STATE: 2, CITY: 3, PROPERTY: 4, ALL: 5, NOTHING: 6 }
    },
    CHECKIN_STATUS: {
        IN: 0, OUT: 1, ALL: 2
    },
    USER_SESSION: {
        PLATFORM: { IOS: 'ios', ANDROID: 'android', WEB: 'web' }
    },
    AMENITIES: {
        STATUS: { ACTIVE: 'active', INACTIVE: 'inactive', ISDELETE: 'isDelete' }
    },
    CATEGORY: {
        STATUS: { ACTIVE: 'active', INACTIVE: 'inactive', DELETE: 'delete' }
    },
    CITY: {
        STATUS: { ACTIVE: 'active', INACTIVE: 'inactive', ISDELETE: 'isDelete' }
    },
    FAV_PROPERTY_STATUS: {
        STATUS: { ACTIVE: 'active', INACTIVE: 'inactive', ISDELETE: 'isDelete' }
    },
    PAYOUT: {
        STATUS: { PENDING: 0, DUE: 1, SUCCESS: 2, REQUEST: 3 }
    },
    COL: {
        ADMIN: 'admins',
        AD_PRICE: 'ad_price',
        ADMIN_SESSION: 'admin_sessions',
        ADMIN_NOTIFICATION: 'admin_notification',
        USER_SESSION: 'user_session',
        HOST_SESSION: 'host_session',
        OFFLINE_USER: 'offlineUser',
        CANCELLATION_POLICY: 'cancellationPolicy',
        PROPERTY_DEMO: 'propertyDemo',
        USER: 'users',
        HOST: 'hosts',
        PARTNERS: 'partners',
        EMPLOYEES: 'employees',
        COHOST: 'cohost',
        NOTIFICATION: 'notifications',
        PROMOTION: 'promotions',
        Payment: 'payments',
        Giftcard: 'giftcards',
        PaymentLogs: 'paymentLogs',
        PartnerFloor: 'partnerFloors',
        USER_COMPANY_Details: 'user_company_details',
        AMENITIES: 'amenities',
        ALLCITIES: 'allCities',
        ALLStates: 'allStates',
        CATEGORY: 'categories',
        PROPERTY: 'properties',
        UNCLAIMED_PROPERTY: 'unclaimedProperties',
        PROPERTY_SPACE: 'propertySpace',
        COUNTRIES: 'countries',
        SUBJECT: 'subject',
        STATES: 'states',
        REVIEWS: 'reviews',
        FAQ: 'faq',
        APPCONFIG: 'appPolicy',
        CITY: 'city',
        CALENDAR: 'calendar',
        RECURRING_PAYMENTS: 'recurringPayments',
        FAVOURITE: 'favourite',
        BOOKING: 'booking',
        LOGS: 'commonlogs',
        BOOKING_CART: 'booking_cart',
        OTP: 'otp',
        RECENT_SEARCH: 'recent_search',
        DYNAMIC_PRICE: 'dynamic_price',
        OFFER_PRICE: 'offers',
        COWORKERS: 'coworkers',
        CONTACT: 'contact',
        PAYOUT: 'payout',
        CONFIG: 'config',
        USER_ANALYTIC: 'userAnalytics',
        CHECKIN: 'check_in'
    },
    PROPERTY_STATUS: {
        ACTIVATE: 'activate',
        DEACTIVATE: 'deactivate',
        ARCHIVE: 'archive'
    },

    REDIS: {
        KEY: {

        },
        PENDING_BOOKING: `pendingBooking`,
        EXPIRY_TIME: 300
    },
    FILTER_BY: {
        KEYS: {
            ACTIVE: "active",
            INACTIVE: "inactive",
        }
    },
    SORT_BY: {
        KEYS: {
            NAME: "name",
            CREATEDAT: "createdAt",
            BOOKING: "booking",
            CANCELLATION: "cancellation"
        },
        ADMIN_USER_LISTING: {
            NO_OF_BOOKINGS: "noOfBooking",
            CREATEDAT: "createdAt"
        },
        ADMIN_HOST_LISTING: {
            NO_OF_BOOKINGS: "noOfProperties",
            CREATEDAT: "createdAt"
        },
        ADMIN_BOOKING_LISTING: {
            USERNAME: 0,
            PROPERTYNAME: 1,
            AMOUNT: 2
        },
        BOOKINF_SORT_ORDER: {
            AUTO: 'auto',
            MANUAL: 'manual'
        },
        ADMIN_FAQ_ORDER: {
            QUESTION: 'questionA',
            ANSWER: 'answer',
            CREATEDAT: 'createdAt',
            PRICE: 'price',
            AVERAGE_RATING: 'avgRating'
        },
        ASC_DESC: {
            ASC: -1,
            DESC: 1,
        }
    },
    MEDIA_TYPE: {
        KEYS: {
            IMAGE: "image",
            VIDEO: "video"
        }
    },

    PROPERTY: {
        DEMO_STATUS: {
            PENDING: 3,
            ACCEPTED: 1,
            REJECTED: 2
        },
        CLAIMED_PROPERTY_STATUS: {
            TOBECLAIMED: 0,
            PENDING: 1,
            SUCCESS: 2,
            FAILURE: 3
        },
        PROMOTION: {
            DURATION: {
                DAILY: 1,
                WEEKLY: 2,
                MONTHLY: 3
            }
        },
        PROMOTION_FLAG: {
            START: 0,
            END: 1
        },
        PROMOTION_STATUS: { ONGOING: 0, EXPIRED: 1, RENEWED: 2, UPCOMING: 3, PENDING: 4 },
        PRICING_TYPE: { HOURLY: 1, MONTHLY: 2, CUSTOM: 3 },
        STATUS: { ACTIVE: 'active', INACTIVE: 'inactive', ISDELETE: 'isDelete', ARCHIVE: 'archive', DRAFT: 'draft' },
        CLAIMED_STATUS: { TRUE: true, FALSE: false },
        STEP_COUNTER: {
            ADD_NAME_AND_ADDRESS: 1,
            ADD_PROPERTY_LOCATION: 2,
            ADD_PROPERTY_INFORMATION: 3,
            ADD_FLOOR_INFO: 4,
            ADD_CATEGORY_PRICE_INFO: 5,
            UPLOAD_IMAGES: 6
        },
        PROPERTY_TYPE: {
            ENTIRE_BUILDING: 1,
            SPECIFIC_FLOOR: 2
        },
        PARTNER_TYPE: {
            FULL_FLOOR: 1,
            PARTIAL_FLOOR: 2
        },
        OFFER: {
            DISCOUNT_LABEL_TYPE: {
                BOOKING_DURATION: 0,
                ADVANCE_BOOKING_DURATION: 1,
                UNITS: 2
            }
        }
    },
    PROPERTY_SPACE: {
        STATUS: { ACTIVE: 'active', INACTIVE: 'inactive', ISDELETE: 'isDelete', ARCHIVE: 'archive' },
    },
    IS_OFFER_PRICE: {
        TRUE: 1,
        FALSE: 0
    }
}

// array of enum values, requires ES2017 and above
export const ENUM_ARRAY = {
    ADMIN: {
        TYPE: Object.values(ENUM.ADMIN.TYPE),
        DEVICE_PLATFORM: Object.values(ENUM.ADMIN.DEVICE_PLATFORM),
        NOTIFICATION: {
            RECIEVER: Object.values(ENUM.ADMIN.NOTIFICATION.RECIEVER)
        },
        SUBJECT: Object.values(ENUM.ADMIN.SUBJECT_TYPE)
    },
    NOTIFICATION: {
        ENABLE: 1,
        DISABLE: 0,
        TOGGLETYPE: {
            EMAILTOGGLE: 1,
            NORMALTOGGLE: 0
        }
    },
    CONFIG_TYPE: {
        ADMOUNT: 0,
        PARTNER_TYPE: 1
    },
    NOTIFICATION_TYPE: Object.values(ENUM.NOTIFICATION_TYPE),
    USER: {
        PROFILE_STATUS: Object.values(ENUM.USER.PROFILE_STATUS),
        STATUS: Object.values(ENUM.USER.STATUS),
        TYPE: Object.values(ENUM.USER.TYPE),
        DEEP_LINK_TYPE: Object.values(ENUM.USER.DEEP_LINK_TYPE),
        GENDER: Object.values(ENUM.USER.GENDER),
        COMPANY_TYPE: Object.values(ENUM.USER.COMPANY_TYPE),
        ACCOUNT_STATUS: Object.values(ENUM.USER.ACCOUNT_STATUS),
        SUB_COMPANY_TYPE: Object.values(ENUM.USER.SUB_COMPANY_TYPE),
        INIVITATION_STATUS: Object.values(ENUM.USER.INIVITATION_STATUS),
        GIFT_CARD_REDEMPTION: Object.values(ENUM.GIFT_CARD.REDEMPTION_STATUS)
    },
    CONFIG: {
        TYPE: Object.values(ENUM.FAQ.TYPE)
    },
    ADVERTISEMENT: {
        ListingPlacement: Object.values(ENUM.ADVERTISEMENT.ListingPlacement)
    },
    FAQ: {
        TYPE: Object.values(ENUM.FAQ.TYPE)
    },
    BOOKING: {
        STATUS: Object.values(ENUM.BOOKING.STATUS)
    },
    DEMO: {
        STATUS: Object.values(ENUM.PROPERTY.DEMO_STATUS)
    },
    USER_BOOKING_STATUS: {
        STATUS: Object.values(ENUM.USER_BOOKING_STATUS.STATUS),
        PROLONGED_STATUS: Object.values(ENUM.BOOKING.PROLONGED_STATUS)
    },
    USER_BOOKING_TYPE: {
        BOOKING_TYPE: Object.values(ENUM.USER.BOOKING_TYPE)
    },
    BOOKING_MODE: {
        TYPE: Object.values(ENUM.BOOKING_TYPE.TYPE)
    },
    SCHEDULE_TYPE: {
        TYPE: Object.values(ENUM.BOOKING.SCHEDULE_TYPE)
    },
    PAYMENT: {
        STATUS: Object.values(ENUM.PAYMENT.STATUS),
        PLAN: Object.values(ENUM.PAYMENT.PLAN)
    },
    USER_SESSION: {
        PLATFORM: Object.values(ENUM.USER_SESSION.PLATFORM)
    },
    SOCIAL_LOGIN_TYPE: {
        PLATFORM: Object.values(ENUM.LOGIN_TYPE)
    },
    FILTERBY: {
        KEYS: Object.values(ENUM.FILTER_BY.KEYS)
    },
    SORT_BY: {
        KEYS: Object.values(ENUM.SORT_BY.KEYS),
        ADMIN_USER_LISTING: Object.values(ENUM.SORT_BY.ADMIN_USER_LISTING),
        ADMIN_HOST_LISTING: Object.values(ENUM.SORT_BY.ADMIN_HOST_LISTING),
        ADMIN_BOOKING_LISTING: Object.values(ENUM.SORT_BY.ADMIN_FAQ_ORDER),
        ADMIN_FAQ_LISTING: Object.values(ENUM.SORT_BY.ADMIN_FAQ_ORDER),
        ASENDING_DESCENDING: Object.values(ENUM.SORT_BY.ASC_DESC)
    },
    MEDIA_TYPE: {
        KEYS: Object.values(ENUM.MEDIA_TYPE.KEYS)
    },
    PAYOUT: {
        STATUS: Object.values(ENUM.PAYOUT.STATUS)
    },
    COHOST: {
        PERMISSION: Object.values(ENUM.COHOST_PERMISSION.STATUS),
        ACCESS_RIGHTS: Object.values(ENUM.ACCESS_RIGHTS)

    },
    COHOST_LEVEL: {
        KEYS: Object.values(ENUM.COHOST_LEVEL)
    },
    PROPERTY: {
        PROMO_DURATION: Object.values(ENUM.PROPERTY.PROMOTION.DURATION),
        PROMO_STATUS: Object.values(ENUM.PROPERTY.PROMOTION_STATUS),
        STEP_COUNTER: Object.values(ENUM.PROPERTY.STEP_COUNTER),
        PROPERTY_TYPE: Object.values(ENUM.PROPERTY.PROPERTY_TYPE),
        PARTNER_TYPE: Object.values(ENUM.PROPERTY.PARTNER_TYPE),
        PRICING_TYPE: Object.values(ENUM.PROPERTY.PRICING_TYPE),
        CLAIMED_STATUS: Object.values(ENUM.PROPERTY.CLAIMED_STATUS)
    }
}