/**
 * @file demo.v1.entity
 * @description defines v1 demo entity methods
 * @author Desk Now Dev Team
*/

import { Model, Types } from "mongoose";
import BaseEntity from "../base.entity";
import DemoModel from "@models/demo.model";
import { UserV1, PropertyV1, HostV1 } from "@entity";
import { emailService, PushNotification } from "@services";
import { TEMPLATER } from "../../htmlHelper";
import { CONFIG, CONSTANT, DATABASE, ENUM, WEB_PANELS } from "@common";
import moment from "moment";

class DemoEntity extends BaseEntity {

    constructor(model: Model<any>) {
        super(model);
    }

    async scheduleDemoEntity(payload: any): Promise<any> {
        try {
            const demoDoc: any = await this.createOne(payload);
            payload.demoId = demoDoc._id
            const propertyDetail: any = await PropertyV1.findOne(
                {
                    _id: Types.ObjectId(payload ?.propertyId)
                },
                {
                    "userData": 1, _id: 0, name: 1, images: 1, address: 1
                });

            const userDetail: any = await UserV1.findOne({ _id: Types.ObjectId(payload ?.userId) }, { email: 1, name: 1, address: 1, image: 1 });
            const hostId = propertyDetail ?.userData ?.userId;
            const userId = payload ?.userId;
            let hostHtml = await TEMPLATER.makeHtmlTemplate(process.cwd() + "/src/views/propertyDemo/hostDemo.html", {
                icSplashLogo: CONSTANT.SPLASH_LOGO,
                logo: CONSTANT.VERIFY_EMAIL_LOGO,
                facebookLogo: CONSTANT.FACEBOOK_LOGO_PNG,
                twitterLogo: CONSTANT.TWITTER_LOGO_NEW,
                linkedinLogo: CONSTANT.LINKEDIN_LOGO,
                igLogo: CONSTANT.IG_LOGO,
                profilePicture: userDetail ?.image,
                userName: propertyDetail.userData.name,
                userAddress: userDetail ?.address,
                propertyName: propertyDetail ?.name,
                demoDate: moment(DATABASE.DATE_CONSTANTS.fromDate(demoDoc ?.demoDate, 330)).format('MMM DD,YYYY'),
                demoTime: demoDoc ?.demoTime,
                redirectionChatUrl: CONFIG.NODE_ENV === 'stag' ? `https://desknowhoststg.appskeeper.com/host/chat?userId=${userId}` : `${WEB_PANELS.HOST_PANEL_PROD}/host/chat?userId=${userId}`,
                webPanelUrl: CONFIG.NODE_ENV === 'stag' ? WEB_PANELS.HOST_PANEL_STAGING : WEB_PANELS.HOST_PANEL_PROD,
                CONTACT_US: CONFIG.NODE_ENV === 'stag' ? WEB_PANELS.CONTACT_US_HOST_STAGING : WEB_PANELS.CONTACT_US_PAM_PROD,
      FAQUrl: CONFIG.NODE_ENV === 'stag' ? WEB_PANELS.FAQ_HOST_STAGING : WEB_PANELS.FAQ_PAM_PROD,
            });
            let userHtml = await TEMPLATER.makeHtmlTemplate(process.cwd() + "/src/views/propertyDemo/userDemo.html", {
                logo: CONSTANT.VERIFY_EMAIL_LOGO,
                icSplashLogo: CONSTANT.SPLASH_LOGO,
                demoStatus: `pending`,
                facebookLogo: CONSTANT.FACEBOOK_LOGO_PNG,
                twitterLogo: CONSTANT.TWITTER_LOGO_NEW,
                linkedinLogo: CONSTANT.LINKEDIN_LOGO,
                igLogo: CONSTANT.IG_LOGO,
                profilePicture: userDetail ?.image,
                userName: userDetail ?.name,
                userAddress: userDetail ?.address,
                propertyName: propertyDetail ?.name,
                webPanelUrl: CONFIG.NODE_ENV === 'stag' ? WEB_PANELS.USER_PANEL_STAGING : WEB_PANELS.USER_PANEL_PROD,
                contactUsUrl: CONFIG.NODE_ENV === 'stag' ? WEB_PANELS.CONTACT_US_STAGING : WEB_PANELS.CONTACT_US_PROD,
                FAQUrl: CONFIG.NODE_ENV === 'stag' ? WEB_PANELS.FAQ_STAGING : WEB_PANELS.FAQ_PROD,
                demoDate: moment(DATABASE.DATE_CONSTANTS.fromDate(demoDoc ?.demoDate, 330)).format('MMM DD,YYYY'),
                demoTime: demoDoc ?.demoTime,
                redirectionChatUrl: CONFIG.NODE_ENV === 'stag' ? `https://desknowuserstg.appskeeper.com/chat?userId=${hostId}` : `${WEB_PANELS.USER_PANEL_PROD}/chat?userId=${hostId}`
            });

            emailService.sendHostDemoInvite(hostHtml, propertyDetail ?.userData ?.email, userDetail ?.name, propertyDetail ?.name );
            emailService.sendUserDemoInvite(userHtml, userDetail ?.email, propertyDetail ?.name);
            payload['userDetail'] = userDetail;
            payload['propertyDetail'] = propertyDetail;
            payload['hostId'] = hostId;
            payload['userId'] = userId;
            const [hostToken, userToken] = await Promise.all([
                await HostV1.fetchHostDeviceToken(hostId),
                await UserV1.fetchUserDeviceToken(userId)
            ]);

            await Promise.all([
                PushNotification.sendHostPropertyDemoPush(hostToken, payload),
                PushNotification.sendUserPropertyDemoPush(userToken, payload),
            ]);
            return demoDoc;
        } catch (error) {
            console.error(`we have an error ==> ${error}`);
        }
    }

    async updateScheduledDemoEntity(payload: any): Promise<any> {
        try {
            const demoDoc: any = await this.updateDocument({ _id: Types.ObjectId(payload.demoId) }, { status: payload.status }, { new: true });
            const propertyDetail: any = await PropertyV1.findOne(
                {
                    _id: Types.ObjectId(demoDoc ?.propertyId)
                },
                {
                    "userData": 1, _id: 0, name: 1, images: 1, address: 1
                });

            const userDetail: any = await UserV1.findOne({ _id: Types.ObjectId(demoDoc ?.userId) }, { email: 1, name: 1, address: 1, image: 1 });
            const hostId = propertyDetail ?.userData ?.userId;
            const userId = payload ?.userId;
            payload['demoDate'] = demoDoc.demoDate;
            payload['demoTime'] = demoDoc.demoTime;
            payload['remark'] = demoDoc.remark;
            payload['userDetail'] = userDetail;
            payload['propertyDetail'] = propertyDetail;
            payload['hostId'] = hostId;
            payload['userId'] = userId;
            const [hostToken, userToken] = await Promise.all([
                await HostV1.fetchHostDeviceToken(hostId),
                await UserV1.fetchUserDeviceToken(userId)
            ]);
            switch (payload.status) {
                case ENUM.PROPERTY.DEMO_STATUS.ACCEPTED:
                    {
                        let hostHtml = await TEMPLATER.makeHtmlTemplate(process.cwd() + "/src/views/propertyDemo/host_demo_status.html", {
                            logo: CONSTANT.VERIFY_EMAIL_LOGO,
                            icSplashLogo: CONSTANT.SPLASH_LOGO,
                            demoStatus: `accepted`,
                            facebookLogo: CONSTANT.FACEBOOK_LOGO_PNG,
                            twitterLogo: CONSTANT.TWITTER_LOGO_NEW,
                            linkedinLogo: CONSTANT.LINKEDIN_LOGO,
                            igLogo: CONSTANT.IG_LOGO,
                            profilePicture: userDetail ?.image,
                            userName: userDetail ?.name,
                            hostName: propertyDetail ?.userData ?.name,
                            userAddress: userDetail ?.address,
                            propertyName: propertyDetail ?.name,
                            demoDate: moment(DATABASE.DATE_CONSTANTS.fromDate(demoDoc ?.demoDate, 330)).format('MMM DD,YYYY'),
                            demoTime: demoDoc ?.demoTime,
                            redirectionChatUrl: CONFIG.NODE_ENV === 'stag' ? `https://desknowhoststg.appskeeper.com/host/chat?userId=${demoDoc.userId}` : `${WEB_PANELS.HOST_PANEL_PROD}/host/chat?userId=${demoDoc.userId}`,
                            webPanelUrl: CONFIG.NODE_ENV === 'stag' ? WEB_PANELS.HOST_PANEL_STAGING : WEB_PANELS.HOST_PANEL_PROD,
                            CONTACT_US: CONFIG.NODE_ENV === 'stag' ? WEB_PANELS.CONTACT_US_HOST_STAGING : WEB_PANELS.CONTACT_US_PAM_PROD,
      FAQUrl: CONFIG.NODE_ENV === 'stag' ? WEB_PANELS.FAQ_HOST_STAGING : WEB_PANELS.FAQ_PAM_PROD,
                        });
                        let userHtml = await TEMPLATER.makeHtmlTemplate(process.cwd() + "/src/views/propertyDemo/userDemoStatus.html", {
                            logo: CONSTANT.VERIFY_EMAIL_LOGO,
                            icSplashLogo: CONSTANT.SPLASH_LOGO,
                            demoStatus: `accepted`,
                            facebookLogo: CONSTANT.FACEBOOK_LOGO_PNG,
                            twitterLogo: CONSTANT.TWITTER_LOGO_NEW,
                            linkedinLogo: CONSTANT.LINKEDIN_LOGO,
                            igLogo: CONSTANT.IG_LOGO,
                            hostName: propertyDetail ?.userData ?.name,
                            profilePicture: userDetail ?.image,
                            userName: userDetail ?.name,
                            userAddress: userDetail ?.address,
                            propertyName: propertyDetail ?.name,
                            demoDate: moment(DATABASE.DATE_CONSTANTS.fromDate(demoDoc ?.demoDate, 330)).format('MMM DD,YYYY'),
                            demoTime: demoDoc ?.demoTime,
                            redirectionChatUrl: CONFIG.NODE_ENV === 'stag' ? `https://desknowuserstg.appskeeper.com/chat?userId=${hostId}` : `${WEB_PANELS.USER_PANEL_PROD}/chat?userId=${hostId}`,
                            webPanelUrl: CONFIG.NODE_ENV === 'stag' ? WEB_PANELS.USER_PANEL_STAGING : WEB_PANELS.USER_PANEL_PROD,
                            contactUsUrl: CONFIG.NODE_ENV === 'stag' ? WEB_PANELS.CONTACT_US_STAGING : WEB_PANELS.CONTACT_US_PROD,
                            FAQUrl: CONFIG.NODE_ENV === 'stag' ? WEB_PANELS.FAQ_STAGING : WEB_PANELS.FAQ_PROD,
                        });
                        await Promise.all([
                            PushNotification.sendHostPropertyDemoAcceptStatusPush(hostToken, payload),
                            PushNotification.sendUserPropertyDemoAcceptStatusPush(userToken, payload),
                            emailService.sendHostUpdateDemoInvite(hostHtml, propertyDetail ?.userData ?.email, "accepted"),
                            emailService.sendUserUpdateDemoInvite(userHtml, userDetail ?.email, "accepted")
                        ])
                    }
                    break;
                case ENUM.PROPERTY.DEMO_STATUS.REJECTED: {
                    let hostHtml = await TEMPLATER.makeHtmlTemplate(process.cwd() + "/src/views/propertyDemo/host_demo_status.html", {
                        logo: CONSTANT.VERIFY_EMAIL_LOGO,
                        icSplashLogo: CONSTANT.SPLASH_LOGO,
                        demoStatus: `rejected`,
                        facebookLogo: CONSTANT.FACEBOOK_LOGO_PNG,
                        twitterLogo: CONSTANT.TWITTER_LOGO_NEW,
                        linkedinLogo: CONSTANT.LINKEDIN_LOGO,
                        igLogo: CONSTANT.IG_LOGO,
                        userName: userDetail ?.name,
                        hostName: propertyDetail ?.userData ?.name,
                        userAddress: userDetail ?.address,
                        propertyName: propertyDetail ?.name,
                        demoDate: moment(DATABASE.DATE_CONSTANTS.fromDate(demoDoc ?.demoDate, 330)).format('MMM DD,YYYY'),
                        demoTime: demoDoc ?.demoTime,
                        redirectionChatUrl: CONFIG.NODE_ENV === 'stag' ? `https://desknowhoststg.appskeeper.com/host/chat?userId=${demoDoc.userId}` : `${WEB_PANELS.HOST_PANEL_PROD}/host/chat?userId=${demoDoc.userId}`,
                        webPanelUrl: CONFIG.NODE_ENV === 'stag' ? WEB_PANELS.HOST_PANEL_STAGING : WEB_PANELS.HOST_PANEL_PROD,
                        CONTACT_US: CONFIG.NODE_ENV === 'stag' ? WEB_PANELS.CONTACT_US_HOST_STAGING : WEB_PANELS.CONTACT_US_PAM_PROD,
      FAQUrl: CONFIG.NODE_ENV === 'stag' ? WEB_PANELS.FAQ_HOST_STAGING : WEB_PANELS.FAQ_PAM_PROD,
                    });
                    let userHtml = await TEMPLATER.makeHtmlTemplate(process.cwd() + "/src/views/propertyDemo/userDemoStatus.html", {
                        logo: CONSTANT.VERIFY_EMAIL_LOGO,
                        icSplashLogo: CONSTANT.SPLASH_LOGO,
                        demoStatus: `rejected`,
                        facebookLogo: CONSTANT.FACEBOOK_LOGO_PNG,
                        twitterLogo: CONSTANT.TWITTER_LOGO_NEW,
                        linkedinLogo: CONSTANT.LINKEDIN_LOGO,
                        igLogo: CONSTANT.IG_LOGO,
                        userName: userDetail ?.name,
                        userAddress: userDetail ?.address,
                        hostName: propertyDetail ?.userData ?.name,
                        propertyName: propertyDetail ?.name,
                        demoDate: moment(DATABASE.DATE_CONSTANTS.fromDate(demoDoc ?.demoDate, 330)).format('MMM DD,YYYY'),
                        demoTime: demoDoc ?.demoTime,
                        redirectionChatUrl: CONFIG.NODE_ENV === 'stag' ? `https://desknowuserstg.appskeeper.com/chat?userId=${hostId}` : `${WEB_PANELS.USER_PANEL_PROD}/chat?userId=${hostId}`,
                        webPanelUrl: CONFIG.NODE_ENV === 'stag' ? WEB_PANELS.USER_PANEL_STAGING : WEB_PANELS.USER_PANEL_PROD,
                        contactUsUrl: CONFIG.NODE_ENV === 'stag' ? WEB_PANELS.CONTACT_US_STAGING : WEB_PANELS.CONTACT_US_PROD,
                        FAQUrl: CONFIG.NODE_ENV === 'stag' ? WEB_PANELS.FAQ_STAGING : WEB_PANELS.FAQ_PROD,
                    });
                    await Promise.all([
                        emailService.sendHostUpdateDemoInvite(hostHtml, propertyDetail ?.userData ?.email, "rejected"),
                        emailService.sendUserUpdateDemoInvite(userHtml, userDetail ?.email, "rejected"),
                        PushNotification.sendHostPropertyDemoRejectStatusPush(hostToken, payload),
                        PushNotification.sendUserPropertyDemoRejectStatusPush(userToken, payload)
                    ])
                }
                    break;
            }
        } catch (error) {
            console.error(`we have an error while updating the scheduled demo ${error} `);
        }
    }
}

export const DemoV1 = new DemoEntity(DemoModel);