/**
 * @file format.common
 * @description defines common formats for notification and emails
 * @created 2019-07-04 22:34:19
 * @author Desk Now Dev Team
*/

import { BASE } from "./config.common";

const EMAIL = {
    ADMIN: {
        PASSWORD_CHANGE: (reciever: string) => ({
            to: reciever,
            subject: 'Password Change Successful',
            text: 'You have successfully changed your password.'
        }),
        FORGOT_PASSWORD: (reciever: string, payload: any) => ({
            to: reciever,
            subject: 'Forgot Password',
            html: `Hello, <br/><br/>Please click on this link to reset your password: <a href="${BASE.ADMIN}/account/reset-password/${payload.metaToken.value}">here</a>`
        }),
        FORGOT_PASSWORD_NEW: (reciever: string, html: any) => ({
            to: reciever,
            subject: 'Forgot Password',
            html: html
        }),
        RESET_PASSWORD: (reciever: string) => ({
            to: reciever,
            subject: 'Password Reset Successful',
            text: `You have successfully resetted your password.`
        }),
        USER_CREDENTIALS: (reciever: string, password: string) => ({
            to: reciever,
            subject: 'Password Reset Successful',
            html: `Hello, <br/><br/>You have been onboarded to Desk Now.<br/><br/>
            Your Credentials are<br/><br/></b>Email:${reciever}<br/><br/>Password:${password}`
        }),
    },
    USER: {
        FORGOT_PASSWORD: (reciever: string, html: any) => ({
            to: reciever,
            subject: 'Forgot Password',
            html: html
        }),
        SIGNUP_OTP: (reciever: string, payload: any) => ({
            to: reciever,
            subject: 'User SignUp',
            html: `Hello, <br/><br/>Your one time passcode is: ${payload.otp}`
        }),
        NEW_SIGNUP_OTP: (reciever: string, html: any) => ({
            to: reciever,
            subject: 'User SignUp',
            html: html
        }),
        NEW_SIGNUP_EMAIL: (reciever: string, html: any) => ({
            to: reciever,
            subject: 'Welcome to DeskNow',
            html: html
        }),
        EMPLOYEE_SHEET_EMAIL: (reciever: string, html: any, attachments: any) => ({
            to: reciever,
            subject: 'Employee Upload Status',
            html: html,
            attachments: attachments
        }),
        ADMIN_SHEET_EMAIL: (reciever: string, html: any, attachments: any) => ({
            to: reciever,
            subject: 'Property Sheet Upload Status',
            html: html,
            attachments: attachments
        }),
        USER_OTP: (reciever: string, html: any) => ({
            to: reciever,
            subject: 'Otp',
            html: html
        }),
        NEW_HOST_SIGNUP_EMAIL: (reciever: string, html: any) => ({
            to: reciever,
            subject: 'Welcome to DeskNow',
            html: html
        }),
        CLAIM_PROPETY_REQUEST: (reciever: string, html: any) => ({
            to: reciever,
            subject: 'Thank you for claiming the listing',
            html: html
        }),
        NEW_GIFT_CARD_EMAIL: (reciever: string, html: any, amount: any, userName: any) => ({
            to: reciever,
            subject: `You received a ${amount} gift card from ${userName}`,
            html: html
        }),
        INVOICE_EMAIL: (reciever: string, html: any) => ({
            to: reciever,
            subject: 'INVOICE',
            html: html
        }),
        AD_INVOICE_EMAIL: (reciever: string, html: any, propertyName: string) => ({
            to: reciever,
            subject: `Your Invoice for your promotion at ${propertyName}`,
            html: html
        }),
        BOOKING_EMAIL: (reciever: string, html: any) => ({
            to: reciever,
            subject: 'BOOKING',
            html: html
        }),
        BOOKING_EMAIL_CONFIRMATION_HOST: (reciever: string, html: any, propertyName: any) => ({
            to: reciever,
            subject: `New Booking received at ${propertyName}`,
            html: html
        }),
        BOOKING_EMAIL_CONFIRMATION_USER: (reciever: string, html: any, propertyName: any, status: any) => ({
            to: reciever,
            subject: `Your booking at ${propertyName} is  ${status}`,
            html: html
        }),
        BOOKING_EMAIL_PENDING_USER: (reciever: string, html: any, propertyName: any) => ({
            to: reciever,
            subject: `Your booking at ${propertyName} is  pending`,
            html: html
        }),
        DEMO: (reciever: string, html: any, userName: string, propertyName: string) => ({
            to: reciever,
            subject: `${userName} has requested a demo at ${propertyName}`,
            html: html
        }),
        DEMO_STATUS: (reciever: string, html: any, status: string) => ({
            to: reciever,
            subject: `Your demo has been ${status}`,
            html: html
        }),
        HOST_DEMO_STATUS: (reciever: string, html: any, status: string) => ({
            to: reciever,
            subject: `You have ${status} the demo`,
            html: html
        }),
        USER_DEMO: (reciever: string, html: any, propertyName: string) => ({
            to: reciever,
            subject: `Your Demo at ${propertyName}`,
            html: html
        }),
        PB: (reciever: string, html: any) => ({
            to: reciever,
            subject: 'Your profile was successfully verified.',
            html: html
        }),
        PB_UNSUCCESS: (reciever: string, html: any) => ({
            to: reciever,
            subject: 'Account not verified, please try again',
            html: html
        }),
        NEW_COHOST_EMAIL: (reciever: string, html: any, hostName: any) => ({
            to: reciever,
            subject: `Pending invitation as a co-host by ${hostName}`,
            html: html
        }),
        NEW_COWORKER_EMAIL: (reciever: string, html: any, userName: any, propertyName: any) => ({
            to: reciever,
            subject: `${userName} has invited you to work together at ${propertyName}`,
            html: html
        }),
        NEW_COUNTACTUS_MAIL: (reciever: string, html: any, adminEmail: any) => ({
            to: reciever,
            subject: 'Thank you for reaching out to us',
            bcc: adminEmail,
            html: html
        }),
        NEW_GIFTCARD_EMAIL: (reciever: string, html: any) => ({
            to: reciever,
            subject: 'Coworker Invited',
            html: html
        }),
        BOOKING_CANCELLED: (reciever: string, html: any) => ({
            to: reciever,
            subject: 'Booking Cancelled!',
            html: html
        }),
        USER_BOOKING_STATUS: (reciever: string, html: any, hostName: any, status: any) => ({
            to: reciever,
            subject: `${hostName} has ${status} your booking`,
            html: html
        }),
        USER_BOOKING_CANCELLED_STATUS: (reciever: string, html: any, hostName: any, status: any) => ({
            to: reciever,
            subject: `You have ${status} the booking`,
            html: html
        }),
        HOST_PROPERTY_CLAIM_STATUS: (reciever: string, html: any, hostName: any, status: any) => ({
            to: reciever,
            subject: `Your property claim request is ${status}`,
            html: html
        }),
        HOST_BOOKING_STATUS: (reciever: string, html: any, userName: any, status: any) => ({
            to: reciever,
            subject: `${userName} has ${status} his booking`,
            html: html
        }),
        HOST_BOOKING_CANCELLED_STATUS: (reciever: string, html: any, userName: any, status: any) => ({
            to: reciever,
            subject: `You have ${status} the booking`,
            html: html
        }),
        BOOKING_ACCEPTED: (reciever: string, html: any) => ({
            to: reciever,
            subject: 'Booking Accepted',
            html: html
        }),
        BOOKING_REJECTED: (reciever: string, html: any) => ({
            to: reciever,
            subject: 'Booking Rejected',
            html: html
        })

    }
}


export const FORMAT = {
    EMAIL
}
