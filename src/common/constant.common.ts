/**
 * @file constant.common
 * @description defines constants for the application
 * @created 2019-05-08 23:49:08
 * @author Desk Now Dev Team
*/

import { BASE, CONFIG, WEB_PANELS } from "./config.common"
import moment from "moment"

export const CONSTANT = {
   PASSWORD_HASH_SALT: "JBDuwwuhd232QYWBXSKHCNKWBwgyew87635",
   EMAIL_TEMPLATES: process.cwd() + `/src/Mailer/`,
   PLACEHOLDER: "https://desk-now-live.s3-eu-west-1.amazonaws.com/imgpsh_fullsize_anim.png",
   NOTIFICATION_BATCH_SIZE: 1000,
   VERIFICATION_TEMPLATES: process.cwd() + `/src/views/emailVerification/`,
   VERIFICATION_TEMPLATES_HOST: process.cwd() + `/src/views/hostEmailVerification/`,
   OUTLOOK_BASE_URL: process.cwd() + `/src/views/outlookRoutes/`,
   VERIFICATION_TEMP: process.cwd() + `/src/views/`,
   VERIFY_EMAIL_LOGO: `${BASE.URL}/images/logo.png`,
   VERIFY_EMAIL_BG: `${BASE.URL}/images/login-bg.png`,
   GIFT_CARD_LOGO: `${BASE.URL}/images/giftCardBg.jpg`,
   GIFT_CARD_BG: `${BASE.URL}/images/giftCardLogo.png`,
   ADDRESS_PIN: `${BASE.URL}/images/addressPin.svg`,
   LINKEDIN_ICON: `${BASE.URL}/images/linkedinLogo.png`,
   ADD_PROPERTY_SAMPLE: `${BASE.URL}/files/AddClaimedPropertySample.xlsx`,
   CLAIMED_STATIC_IMAGES: [
      `${BASE.URL}/images/propertyPlaceHolder11.svg`,
      `${BASE.URL}/images/propertyPlaceHolder11.svg`
   ],
   APP_STORE_BADGE: `${BASE.URL}/images/App_Store_Badge_US_Black.png`,
   COMPLEMENTRAY_2: `${BASE.URL}/images/complementary2_1.jpg`,
   FACEBOOK_LOGO_PNG: `${BASE.URL}/images/facebookLogo.png`,
   GOOGLE_PLAY_BADGE: `${BASE.URL}/images/Google_Play_Badge_US.png`,
   INSTAGRAM_LOGO: `${BASE.URL}/images/instagramLogo.png`,
   LINKEDIN_LOGO: `${BASE.URL}/images/linkedinLogo.png`,
   MOCKUPER_6: `${BASE.URL}/images/mockuper_6.png`,
   PEXELS_COTTONBRO: `${BASE.URL}/images/pexels-cottonbro-3201783.jpg`,
   PEXELS_DARIA: `${BASE.URL}/images/pexels-daria-shevtsova-1467435.jpg`,
   PEXELS_PEW: `${BASE.URL}/images/pexels-pew-nguyen-244133.jpg`,
   TWITTER_LOGO_NEW: `${BASE.URL}/images/twitterLogo.png`,
   BANNER_PNG: `${BASE.URL}/images/banner.png`,
   SPLASH_LOGO: `${BASE.URL}/images/splash.svg`,
   PAM_LOGO: `${BASE.URL}/images/Pamlogo.png`,
   FACEBOOK_LOGO: `${BASE.URL}/images/facebook.svg`,
   IG_LOGO: `${BASE.URL}/images/instagramLogo.png`,
   ASSETS_PATH: process.env + "./asset",
   MIN_EVENT_START_TIME: new Date(new Date().getTime() + 55 * 60 * 1000).toISOString(),  //55 MIN AHEAD OF TIME
   MIN_EVENT_DURATION: 30, //MINUTES
   OTP_EXPIRY_LIMIT: 2 * 60 * 1000, // 5 minutes
   FALLBACK: "http://www.desk-now.com/",
   PAM_FALLBACK: "${WEB_PANELS.HOST_PANEL_PROD}/",
   IOS_LINK: "desknowseeker://com.desknow/",
   IOS_STORE_LINK: "https://apps.apple.com/us/app/desknow/id1529222764?ign-mpt=uo%3D2https://apps.apple.com/us/app/desknow/id1529222764?ign-mpt=uo%3D2",
   ANDROID_LINK: "deskseeker://com.desknow/",
   ANDROID_PACKAGE_NAME: "com.desknow.user",
   BY_PASS_OTP: '4321',
   PAM_IOS_LINK: "desknowhost://com.desknow/",
   PAM_IOS_STORE_LINK: "https://apps.apple.com/in/app/pam-by-desknow/id1529556888",
   PAM_ANDROID_LINK: "deskhost://com.desknow/",
   PAM_ANDROID_PACKAGE_NAME: "com.desknow.host",
   BASIC_USER_CARS_LIMIT: 1,
   BASIC_USER_IMAGE_LIMIT: 9,
   ELITE_USER_IMAGE_LIMIT: 16,
   MAP_VIEW_EVENTS_DISTANCE: 25 * 1000,
   FAV_ACTION: {
      ADD: 1,
      REMOVE: 0
   },
   PROPERTY_USER_TYPE: {
      USER: 1,
      EMPLOYEE: 2
   },
   FAQ_ACTION: {
      ACTIVE: 1,
      INACTIVE: 2
   },
   FAQ_SORT_ORDER_ACTION: {
      QUESTION: 'question',
      ANSWER: 'answer'
   },
   ADMIN_TAXES_LEVEL: {
      COUNTRY: 1,
      STATE: 2
   },
   TANDC: {
      TERMSANDCONDITION: 1,
      PRIVACYPOLICY: 2,
      ABOUTUS: 3,
      FAQ: 4,
      STORY: 5,
      TEAM: 6
   },
   TANDC_EDITOR: {
      EDITOR: 1,
      EDIT_HTML: 2
   },
   TANDCDEFAULT: {
      TERMSANDCONDITION: 'Please Enter Terms And Condition',
      PRIVACYPOLICY: 'Please Enter Privacy Policy',
      ABOUTUS: 'Please fill AboutUs'
   },
   FAV_BOOKING_ACTION: {
      PREVIOUS: 0,
      NEVER: 1
   },
   BOOKING: {
      REQUEST: 0,
      ACCEPTED: 1,
      REJECTED: 2,
      OFFLINE: 3,
      HISTORY: 4,
      ONLINE: 5,
      UPCOMING: 6,
      ONGOING: 7,
      ALL: 8,
      STATUS: { ONGOING: 0, COMPLETED: 1, CANCELLED: 2, REJECTED: 4, ABANDONED: 5, ACCEPTED: 6 },
   },
   PAYMENT_TYPE: {
      PENDING: 0,
      SETTLED: 1,
      TOTAL: 2 //for web 
   },
   BOOKING_HOST_SORT: {
      AUTO: 0,
      MANUAL: 1,
      ALL: 2 //for web 
   },
   BOOKING_REQUEST_STATUS: {
      ACCEPT: 0,
      REJECT: 1
   },
   BOOKING_SORT_KEY: {
      USERNAME: 0,
      PROPERTYNAME: 1,
      AMOUNT: 2,
   },
   SEARCH_TYPE: {
      HOSTNAME: 0,
      BOOKINGID: 1,
      PROPERTYID: 2,
   },
   STATUS: {
      ACTIVE: 'active',
      INACRIVE: 'inactive',
      ARCHIVE: 'archive',
      DELETED: 'deleted'
   },
   CALENDER_STATICS: {
      MONTH: 30,
      YEAR: 365,
      TOTAL_MONTHS: 12
   },
   TAXES: {
      BASIC: 0,
      DIVISOR: 100
   },
   EMAILER_URLS: {
      WEB_PANEL: CONFIG.NODE_ENV === 'stag' ? WEB_PANELS.HOST_PANEL_STAGING : WEB_PANELS.HOST_PANEL_PROD,
      CONTACT_US: CONFIG.NODE_ENV === 'stag' ? WEB_PANELS.CONTACT_US_HOST_STAGING : WEB_PANELS.CONTACT_US_PAM_PROD,
      FAQUrl: CONFIG.NODE_ENV === 'stag' ? WEB_PANELS.FAQ_HOST_STAGING : WEB_PANELS.FAQ_PAM_PROD,
   }
}

export const ENVIRONMENT = {
   PRODUCTION: `production`,
   DEVELOPMENT: `development`,
   DEFAULT: 'default'
}

export const URL = {
   DEV: 'https://desknowuserdev.appskeeper.com/'
}
export const PROPERTY_STATUS = {
   ACTIVATE: 'active',
   DEACTIVATE: 'deactive',
   ARCHIVE: 'archive',
   INACTIVATE: 'inactive',
   ISDELETE: 'isDelete'
}

export const BOOKING_REQUEST_STATUS = {
   ACCEPT: 0,
   REJECT: 1
}


export const DATABASE = {
   ACTIVE: 'active',
   FORMATED_RESPONSE_TYPE: {
      VERIFY_OTP: 'verify_otp'
   },
   MONGO_TTL: {
      EXPIRED_OTP: 120
   },
   REDIS: {
      EXP_TIME: 6000,
      OTP_EXPIRED_TIME: 60,
      RESET_TOKEN_EMAIL: 60 * 60,
      KEY_NAMES: {
         DYNAMIC_PRICE_LABEL: 'dynamic-price-label',
         CATEGORY_AMENITIES: 'categories-amenities',
         CATEGORY_SUBACTEGORIES_HASH: 'categories-subcategories',
         AMENITIES_HASH: 'amenities',
         LIKE_COUNT: "likeCount",
         SCHEDULE: "SCHEDULE",
         EXPIRE: "EXPIRE",
         IP: "ip",
         DISCONNECT: "DISCONNECT",
         DEVICE_TOKEN_HASH: 'session',
         OTP_HASH: 'phone-otp',
         SOCKET_ID: 'socket',
         USER_MAP: 'user-map',
         RADIUS: 10,
         RADIUSUNIT: 'km',
         COUNT: 1,
         APP_CONFIG: 'app-config'
      }
   },
   DATE_CONSTANTS: {
      monthStart: (month: number, year: number) => { return moment().year(year).month(month - 1).startOf('month').toDate() },

      monthEnd: (month: number, year: number) => { return moment().year(year).month(month - 1).endOf('month').toDate() },

      yearStart: (year: number) => { return moment().year(year).startOf('year').toDate() },

      yearEnd: (year: number) => { return moment().year(year).endOf('year').toDate() },

      nextYear: (offset: number) => { return moment().utcOffset(Math.floor(offset / 60000)).add(1, 'y').toDate() },

      deleteOn: (days: number) => { return moment().utcOffset(0).add(days, 'd').toDate() },

      toUtc: (date: string | number | void | moment.Moment | Date | (string | number)[] | moment.MomentInputObject | undefined) => { return moment(date).toDate() },

      addDurationToDate: (date: string, duration: string, type: any) => { return moment(date).add(duration, type).toDate() },

      subtractMinFromUtc: (date: string | number | void | moment.Moment | Date | (string | number)[] | moment.MomentInputObject | undefined, timeToSubtract: string | number | void | moment.Duration | moment.FromTo | moment.DurationInputObject | undefined) => { return moment(date).subtract(timeToSubtract, 'm').toDate() },

      pastFiveMinutes: (offset: number, date?: string | number | void | moment.Moment | Date | (string | number)[] | moment.MomentInputObject | undefined) => { return date ? moment(date).utcOffset(Math.floor(offset / 60000)).subtract(5, 'm').toDate() : moment().utcOffset(0).subtract(5, 'm').toDate() },

      currentTime: (offset?: number) => { return offset ? moment().utcOffset(Math.floor(offset / 60000)).toDate() : moment().utcOffset(0).toDate() },

      fromDate: (date: string, offset: number) => {
         return moment(date).utcOffset(Math.floor(offset / 60000)).toDate();
      },

      hourlyFromDate: (date: string, offset: number) => {
         return moment(date).utcOffset(Math.floor(offset / 60000)).add(1, 'seconds').toDate();
      },

      toDate: (date: string, offset: number) => {
         return moment(date).utcOffset(Math.floor(offset / 60000)).toDate();
      },

      hourlyToDate: (date: string, offset: number) => {
         return moment(date).utcOffset(Math.floor(offset / 60000)).subtract(1, 'seconds').toDate();
      },

      formatTime: (date: string, offset: number) => {
         return moment(date).utcOffset(Math.floor(offset / 60000)).format('MMM DD,YYYY');
      },
      utcTimeDate: (date: string) => { return moment(date).utc().toDate() },

      lastTwentyFourHours: (offset?: number) => { return offset ? moment().utcOffset(Math.floor(offset / 60000)).subtract(7, 'd').toDate() : moment().utcOffset(0).subtract(7, 'd').toDate() },

      pastDay: (offset: number, date?: string) => { return date ? moment(parseInt(date)).utcOffset(Math.floor(offset / 60000)).subtract(1, 'd').toDate() : moment().utcOffset(Math.floor(offset / 60000)).subtract(1, 'd').toDate() },

      midNightTime: (date?: string, offset?: number) => { return date ? moment(parseInt(date)).utcOffset(offset ? Math.floor(offset / 60000) : 330).endOf('d').toDate() : moment().utcOffset(0).endOf('d').toDate() },

      previousMidNight: () => { return moment().utcOffset(0).subtract(1, 'd').startOf('d').toDate() },

      midNightTimeStamp: () => { return moment().utcOffset(0).endOf('d').unix() },

      nextSevenDayDate: (date: any, offset?: number) => { return moment(parseInt(date)).utcOffset(offset ? Math.floor(offset / 60000) : 330).add(7, 'd').endOf('d').toDate() },

      currentUtcTimeStamp: () => { return moment().utc().unix() * 1000 },

      currentUtcTimeDate: () => { return moment().utc().toDate() },

      utcMidNightTimestamp: () => { return moment().utc().endOf('d').unix() * 1000 },

      nextFiveMinutes: () => {
         return moment().utcOffset(0).add(4, 'm').unix() * 1000
      },

      previousFiveMinutes: () => {
         return moment().utcOffset(0).subtract(5, 'm').unix() * 1000
      },

      currentLocalDay: (offset: number) => {
         return new Date(new Date(new Date().getTime() + offset).setHours(0, 0, 0, 0))
      },

      calculateCurrentDate: (date: string, offset: number) => {
         return moment(date).add(Math.abs(offset), "minute").toDate();
      },

      calculateEndOfDay: (date: string, offset: number) => {
         return moment(date).endOf('day').toDate()
      },


   },
}