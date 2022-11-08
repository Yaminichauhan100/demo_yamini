import { ENUM } from "./enum.common";
import { TEMPLATER } from "../htmlHelper";
import { CONSTANT } from "./constant.common";
import { BASE, CONFIG, WEB_PANELS, REDIRECTION_URL } from "./config.common";


export const AmenityFilter = {
    $filter:
    {
        input: "$amenities",
        as: "grade",
        cond: { $eq: ["$$grade.status", ENUM.PROPERTY_SPACE.STATUS.ACTIVE] }
    }
}


export const checkDuration = (params: any) => {
    if (params == ENUM.PROPERTY.PROMOTION.DURATION.DAILY) return 'Day'
    else if (params == ENUM.PROPERTY.PROMOTION.DURATION.MONTHLY) return 'Month'
    else return 'Week'
}

export const checkListing = (params: any) => {
    if (params == ENUM.ADVERTISEMENT.ListingPlacement.LISTING) return 'Listing'
    else return 'Landing'
}


export const checkSlot = (params: any, listingType: any) => {
    switch (listingType) {
        case ENUM.ADVERTISEMENT.ListingPlacement.HOME:
            if (params.slotType == 1) return "Top4"
            else if (params.slotType == 2) return "Top8"
            else return "Top12"
        case ENUM.ADVERTISEMENT.ListingPlacement.LISTING:
            if (params.slotType == 1) return "First property"
            else if (params.slotType == 2) return "Second property"
            else return "Third property"
    }
    return "N/A"
}

export const DeepLink = async (params: any) => {
    try {
        let type = params.type;
        let url: any = {};
        let redirectType = 1;
        switch (type) {
            case 1: {
                redirectType = 1;
                url.android = `${REDIRECTION_URL.ADNROID_URL_USER}?type=${redirectType}\&_id=${params.shareId.toString()}`;
                url.iosLink = `${REDIRECTION_URL.IOS_URL_USER}?type=${redirectType}\&_id=${params.shareId.toString()}`;
                url.url = `${WEB_PANELS.USER_PANEL_PROD}/property/detail/${params.shareId.toString()}`
                let obj = {
                    fallback: CONSTANT.FALLBACK,
                    url: url.url,
                    android_package_name: CONSTANT.ANDROID_PACKAGE_NAME,
                    android: url.android,
                    ios_store_link: CONSTANT.IOS_STORE_LINK,
                    iosLink: url.iosLink
                };
                return obj;
            }
            case 2: {
                redirectType = 2
                url.android = `deskhost://com.desknow.host?type=${redirectType}\&_id=${params.shareId.toString()}`
                url.iosLink = `desknowhost://com.desknow/?type=${redirectType}\&_id=${params.shareId.toString()}`
                url.url = `${WEB_PANELS.HOST_PANEL_PROD}/claim-property/${params.shareId.toString()}`
                let obj = {
                    fallback: CONSTANT.PAM_FALLBACK,
                    url: url.url,
                    android_package_name: CONSTANT.PAM_ANDROID_PACKAGE_NAME,
                    android: url.android,
                    ios_store_link: CONSTANT.PAM_IOS_STORE_LINK,
                    iosLink: url.iosLink
                };
                return obj;
            }
            case 3: {
                redirectType = 3;
                url.android = `${REDIRECTION_URL.ADNROID_URL_USER}?type=${redirectType}\&name=${params.name}\&email=${params.email}\&phoneNo=${params.phoneNo}\&countryCode=${params.countryCode}`;
                url.iosLink = `${REDIRECTION_URL.IOS_URL_USER}?type=${redirectType}\&name=${params.name}\&email=${params.email}\&phoneNo=${params.phoneNo}\&countryCode=${params.countryCode}`;
                url.url = `${WEB_PANELS.USER_PANEL_PROD}/account/signup?name=${params.name}\&email=${params.email}\&phoneNo=${params.phoneNo}\&countryCode=${params.countryCode}`;
                let obj = {
                    fallback: CONSTANT.FALLBACK,
                    url: url.url,
                    android_package_name: CONSTANT.ANDROID_PACKAGE_NAME,
                    android: url.android,
                    ios_store_link: CONSTANT.IOS_STORE_LINK,
                    iosLink: url.iosLink
                };
                return obj;
            }
        }
        return url;
    } catch (error) {
        console.error("error in DeepLink inside function.common", error)
    }
}


export const employeeSignupTemplater = async (payload: any, partnerName: any) => {
    try {
        return TEMPLATER.makeHtmlTemplate(`${CONSTANT.EMAIL_TEMPLATES}` + `employee-welcome.html`, {
            name: payload.name,
            ASSET_PATH: BASE.URL,
            url: `${WEB_PANELS.USER_PANEL_DEEP_LINK__API_BASE_URL}?name=${payload.name}&countryCode=${payload.countryCode}&phoneNo=${payload.phoneNo}&type=3&email=${payload.email}`,
            partnerName: partnerName,
            logo: CONSTANT.VERIFY_EMAIL_LOGO,
            facebookLogo: CONSTANT.FACEBOOK_LOGO_PNG,
            igLogo: CONSTANT.INSTAGRAM_LOGO,
            twitterLogo: CONSTANT.TWITTER_LOGO_NEW,
            linkedinLogo: CONSTANT.LINKEDIN_LOGO,
            welcome: "DeskNow",
            fbUrl: WEB_PANELS.FB_URL,
            instaUrl: WEB_PANELS.INSTA_URL,
            twitterUrl: WEB_PANELS.TWITTER_URL,
            linkedinUrl: WEB_PANELS.LINKEDIN_URL,
            webPanelUrl: CONFIG.NODE_ENV === 'stag' ? WEB_PANELS.USER_PANEL_STAGING : WEB_PANELS.USER_PANEL_PROD,
            contactUsUrl: CONFIG.NODE_ENV === 'stag' ? WEB_PANELS.CONTACT_US_STAGING : WEB_PANELS.CONTACT_US_PROD,
            FAQUrl: CONFIG.NODE_ENV === 'stag' ? WEB_PANELS.FAQ_STAGING : WEB_PANELS.FAQ_PROD
        });
    } catch (error) {
        console.error("error in employeeSignupTemplater", error)
    }
}

