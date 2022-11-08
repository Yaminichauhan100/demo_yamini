// /**
//  * @file s3.aws.service
//  * @description defines AWS S3 methods
//  * @author Desk Now Dev Team
// */

// import { SNS } from "aws-sdk";
// import { CONFIG } from "@common";
// class SnsServiceClass {
//     private sns: SNS
//     constructor() {
//         this.sns = new SNS({
//             accessKeyId: CONFIG.SNS.ACCESS_KEY,
//             secretAccessKey: CONFIG.SNS.SECRET_KEY,
//             region: CONFIG.SNS.REGION
//         })
//     }
//     async sendSms(phone: string, OTP: number) {
//         console.log("send sms method call =========>", phone, OTP);
//         this.sns.publish({
//             Message: `Your OTP for Desk Now sign-up is ${OTP}`,
//             Subject: "Desk Now Sign Up",
//             PhoneNumber: phone
//         }, (err, data) => {
//             if (err) console.log("error", err)
//             console.log("data ===> ", data)
//         })
//     }
// }

// export const SnsService = new SnsServiceClass();

