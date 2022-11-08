// /**
//  * @file s3.aws.service
//  * @description defines AWS S3 methods
//  * @author Desk Now Dev Team
// */
// import AWS_S3 from "aws-sdk/clients/s3";
// import { createReadStream, unlink } from "fs";
// import { BASE, CONFIG } from "@common";
// class S3ServiceClass {

//     private s3: AWS_S3;
//     private bucket: string;
//     private basePath: string;

//     constructor(basePath: string) {
//         this.bucket = 'desk-now-live';
//         this.basePath = basePath;
//         this.s3 = new AWS_S3({
//             accessKeyId: CONFIG.S3.ACCESS_KEY,
//             secretAccessKey: CONFIG.S3.SECRET_KEY
//         });
//     }

//     /**
//      * uploads data to S3 bucket
//      * @param name - name of the file
//      * @param data - file data object
//      */
//     async upload(name: string, data: any): Promise<any> {
//         try {
//             const localFilePath = data;
//             let readStream = createReadStream(data);
//             const params = {
//                 Key: `${this.basePath}${name}.pdf`,
//                 Body: readStream,
//                 Bucket: this.bucket,
//                 ACL: 'public-read'
//             };
//             return new Promise((resolve, reject) => {
//                 this.s3.upload(params, (err: any, data: any) => {
//                     readStream.destroy();
//                     if (err) {
//                         console.error(`Error while readStream==>`, err);
//                         return reject(err);
//                     }
//                     unlink(localFilePath, (err: any) => {
//                         if (err) {
//                             console.error(`file deletion failed!!`);
//                         }
//                         console.info(`file deleted`);
//                     });
//                     return resolve(data);
//                 });
//             });
//         } catch (error) {
//             console.error(`we have an error while uploading doc to s3,${error}`);
//         }
//     }

//     async uploadImage(name: string, data: any): Promise<any> {
//         try {
//             const localFilePath = data;
//             let readStream = createReadStream(data);
//             const params = {
//                 Key: `${this.basePath}${name}`,
//                 Body: readStream,
//                 Bucket: this.bucket,
//                 ACL: 'public-read'
//             };
//             return new Promise((resolve, reject) => {
//                 this.s3.upload(params, (err: any, data: any) => {
//                     readStream.destroy();
//                     if (err) {
//                         console.error(`Error while readStream==>`, err);
//                         return reject(err);
//                     }
//                     unlink(localFilePath, (err: any) => {
//                         if (err) {
//                             console.error(`file deletion failed!!`);
//                         }
//                         console.info(`file deleted`);
//                     });
//                     return resolve(data);
//                 });
//             });
//         } catch (error) {
//             console.error(`we have an error while uploading doc to s3,${error}`);
//         }
//     }

//     async uploadVideo(name: string, data: any): Promise<any> {
//         try {
//             const localFilePath = data;
//             let readStream = createReadStream(data);
//             const params = {
//                 Key: `${this.basePath}${name}`,
//                 Body: readStream,
//                 Bucket: this.bucket,
//                 ACL: 'public-read'
//             };
//             return new Promise((resolve, reject) => {
//                 this.s3.upload(params, (err: any, data: any) => {
//                     readStream.destroy();
//                     if (err) {
//                         console.error(`Error while readStream==>`, err);
//                         return reject(err);
//                     }
//                     unlink(localFilePath, (err: any) => {
//                         if (err) {
//                             console.error(`file deletion failed!!`);
//                         }
//                         console.info(`file deleted`);
//                     });
//                     return resolve(data);
//                 });
//             });
//         } catch (error) {
//             console.error(`we have an error while uploading doc to s3,${error}`);
//         }
//     }

//     async uploadExcel(name: string, data: any): Promise<any> {
//         try {
//             const localFilePath = data;
//             let readStream = createReadStream(data);
//             const params = {
//                 Key: `${this.basePath}${name}`,
//                 Body: readStream,
//                 Bucket: this.bucket,
//                 ACL: 'public-read'
//             };
//             return new Promise((resolve, reject) => {
//                 this.s3.upload(params, (err: any, data: any) => {
//                     readStream.destroy();
//                     if (err) {
//                         console.error(`Error while readStream==>`, err);
//                         return reject(err);
//                     }
//                     unlink(localFilePath, (err: any) => {
//                         if (err) {
//                             console.error(`file deletion failed!!`);
//                         }
//                         console.info(`file deleted`);
//                     });
//                     return resolve(data);
//                 });
//             });
//         } catch (error) {
//             console.error(`we have an error while uploading doc to s3,${error}`);
//         }
//     }
// }

// export const S3Invoice = new S3ServiceClass(BASE.AWS.INVOICE_PATH);