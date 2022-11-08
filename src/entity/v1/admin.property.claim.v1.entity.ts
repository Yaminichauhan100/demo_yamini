/**
 * @file admin.claim.property.v1.entity
 * @description defines v1 admin property entity methods
 * @author Desk Now Dev Team
*/

import { Model, Types } from "mongoose";
import BaseEntity from "../base.entity";
import AdminPropertyModel from "@models/properties.model";
import { CONFIG, CONSTANT, ENUM, FORMAT, RESPONSE, WEB_PANELS } from "@common";
import { PartnerV1, PropertySpaceV1, PropertyV1 } from "@entity";
import { handleEntityResponse } from "@baseController";
import { Mailer, S3Invoice } from "@services";
import { TEMPLATER } from "../../htmlHelper";
const xl = require('excel4node');

class AdminPropertyClaimEntity extends BaseEntity {


    constructor(model: Model<any>) {
        super(model);
    }

    async insertBulkProperties(data: any, locationPayload: any, adminDetail: any) {
        try {
            console.log(`sheetPayload ==>`, data);
            const mappedPropertyData = await this.mapBulkPropertyData(data, locationPayload);
            await this.bulkWritePropertyModel(mappedPropertyData, adminDetail);
        } catch (error) {
            console.error(`we have an error in insertBulkProperties entity ==> ${error}`);
        }
    }
    async bulkWritePropertyModel(mappedPropertyData: any, adminDetail: any) {
        try {
            const generatedSheet = await this.generateExcelFile(mappedPropertyData);

            for (let i = 0; i < mappedPropertyData.length; i++) {
                if (mappedPropertyData[i]?.insertionStatus === 'success') {
                    const payload = mappedPropertyData[i];
                    const addedPropertyDetail = await PropertyV1.saveProperty(payload);
                    await PropertyV1.postUpdatePropertyDocument(addedPropertyDetail);
                }
            }

            let html = await TEMPLATER.makeHtmlTemplate(process.cwd() + "/src/views/adminSheetStatus.html", {
                logo: CONSTANT.VERIFY_EMAIL_LOGO,
                facebookLogo: CONSTANT.FACEBOOK_LOGO_PNG,
                twitterLogo: CONSTANT.TWITTER_LOGO_NEW,
                linkedinLogo: CONSTANT.LINKEDIN_LOGO,
                igLogo: CONSTANT.INSTAGRAM_LOGO,
                bannerLogo: CONSTANT.BANNER_PNG,
                userName: 'Admin',
                webPanelUrl: CONFIG.NODE_ENV === 'stag' ? WEB_PANELS.USER_PANEL_STAGING : WEB_PANELS.USER_PANEL_PROD,
                contactUsUrl: CONFIG.NODE_ENV === 'stag' ? WEB_PANELS.CONTACT_US_STAGING : WEB_PANELS.CONTACT_US_PROD,
                FAQUrl: CONFIG.NODE_ENV === 'stag' ? WEB_PANELS.FAQ_STAGING : WEB_PANELS.FAQ_PROD
            });


            setTimeout(async () => {
                let s3Object = await S3Invoice.uploadExcel(
                    `${generatedSheet}`,
                    `${process.cwd()}/public/invoices/${generatedSheet}`
                );
                if (s3Object?.LocationUrl) {
                    await Mailer.sendMail(FORMAT.EMAIL.USER.ADMIN_SHEET_EMAIL(adminDetail?.email, html, [
                        {
                            fileName: "Property Upload Status",
                            path: `${process.cwd()}/public/invoices/${generatedSheet}`
                        }]
                    ));
                }
            }, 1000);
        } catch (error) {
            console.error(`we have an error in bulkWritePropertyModel entity ==> ${error}`);
        }
    }

    async generateExcelFile(fileData: any): Promise<any> {
        try {
            let wb = new xl.Workbook();
            let ws = wb.addWorksheet('Sheet');
            ws.cell(1, 1).string('Name');
            ws.cell(1, 2).string('AddressLine1');
            ws.cell(1, 3).string('AddressLine2');
            ws.cell(1, 4).string('Pincode');
            ws.cell(1, 5).string('Description');
            ws.cell(1, 6).string('Coordinates');
            ws.cell(1, 7).string('StartingPrice');
            ws.cell(1, 8).string('TotalFloors');
            ws.cell(1, 9).string('Capacity');
            ws.cell(1, 10).string('BuildingType');
            ws.cell(1, 11).string('HostedBy');
            ws.cell(1, 12).string('insertionStatus');

            // add data from json
            for (let i = 0; i < fileData.length; i++) {
                let row = i + 2;
                ws.cell(row, 1).string(fileData[i].Name);
                ws.cell(row, 2).string(fileData[i].AddressLine1);
                ws.cell(row, 3).string(fileData[i].AddressLine2);
                ws.cell(row, 4).string(fileData[i].Pincode);
                ws.cell(row, 5).string(fileData[i].Description);
                ws.cell(row, 6).string(fileData[i].Coordinates);
                ws.cell(row, 7).string(fileData[i].StartingPrice);
                ws.cell(row, 8).string(fileData[i].TotalFloors);
                ws.cell(row, 9).string(fileData[i].Capacity);
                ws.cell(row, 10).string(fileData[i].BuildingType);
                ws.cell(row, 11).string(fileData[i].HostedBy);
                ws.cell(row, 12).string(fileData[i]?.insertionStatus ? fileData[i]?.insertionStatus : 'success');
            }
            const fileName = `sheet_${Date.now()}.xlsx`;
            await wb.write(`./public/invoices/${fileName}`);
            return fileName;
        } catch (error) {
            console.error(`we have an error in generateExcelFile method => ${error}`);
        }
    }

    async mapBulkPropertyData(propertyPayload: any, locationPayload: any) {
        try {
            return propertyPayload.map((payload: any) => {
                if (payload?.AddressLine1 && payload?.AddressLine2) {
                    payload['address'] = payload?.AddressLine1 + ', ' + payload?.AddressLine2 + ', ' + JSON.parse(locationPayload?.city)?.cityName + ', ' + JSON.parse(locationPayload?.state)?.name + ', ' + JSON.parse(locationPayload?.country)?.name
                } else {
                    payload['address'] = payload?.AddressLine1 + ', ' + JSON.parse(locationPayload?.city)?.cityName + ', ' + JSON.parse(locationPayload?.state)?.name + ', ' + JSON.parse(locationPayload?.country)?.name
                }

                payload['userData'] = { name: payload?.HostedBy };
                payload?.Name ? payload['name'] = payload?.Name : payload['insertionStatus'] = 'failed';
                payload['addressPrimary'] = payload?.AddressLine1;
                payload['addressSecondary'] = payload?.AddressLine2;
                payload['zipCode'] = payload?.Pincode;

                payload?.Description && payload?.Description?.length <= 450 ? payload['description'] = payload?.Description.split('+').join().trim() : payload['insertionStatus'] = 'failed';

                payload['claimedStatus'] = false;
                payload['images'] = CONSTANT.CLAIMED_STATIC_IMAGES;

                payload['country'] = JSON.parse(locationPayload?.country);
                payload['state'] = JSON.parse(locationPayload?.state);
                payload['city'] = JSON.parse(locationPayload?.city);

                payload['location'] = payload['location'] ? { coordinates: JSON.parse(payload?.Coordinates) } : { coordinates: [0, 0] };
                payload['location']['type'] = "Point";

                payload['propertyType'] = payload?.BuildingType?.startsWith('Entire') ?
                    ENUM.PROPERTY.PARTNER_TYPE.FULL_FLOOR :
                    ENUM.PROPERTY.PARTNER_TYPE.PARTIAL_FLOOR;

                payload['startingPrice'] = payload?.StartingPrice ? payload?.StartingPrice : 0;
                payload['totalCapacity'] = payload?.Capacity;
                payload['status'] = ENUM.PROPERTY.STATUS.DRAFT;
                payload['totalFloorCount'] = payload?.TotalFloors;
                payload['insertionStatus'] ? payload['insertionStatus'] : payload['insertionStatus'] = 'success';
                console.log(`add property payload ==>`, payload);
                return payload;
            })
        } catch (error) {
            console.error(`we have an error in mapBulkPropertyData entity -- ==> ${error}`);
        }
    }

    async validateAndUpdateProperty(property: any, payload: any, headers: any, res: any): Promise<any> {
        try {
            const propertyData = await this.formatUpdatePropertyPayload(payload, property);
            propertyData['location'] = payload['location'];
            await PropertyV1.updateProperty(propertyData, payload.id);
            return handleEntityResponse.sendResponse(res, RESPONSE.PROPERTY(res.locals.lang).PROPERTY_UPDATED);
        } catch (error) {
            console.error(`we have an error in validateAndUpdateProperty ==> ${error}`);
        }
    }

    async formatUpdatePropertyPayload(payload: any, property: any): Promise<any> {
        try {
            let propertyData: any = {
                status: property.status,
                propertyId: property._id,
                name: property.name,
                address: property?.address,
                images: property.images,
                autoAcceptUpcomingBooking: property.autoAcceptUpcomingBooking
            }

            if (payload.images) { propertyData['images'] = payload.images; }

            payload['addressPrimary'] ? propertyData['addressPrimary'] = payload?.addressPrimary : "";
            payload['addressSecondary'] ? propertyData['addressSecondary'] = payload?.addressSecondary : "";

            payload['startingPrice'] ? propertyData['startingPrice'] = payload?.startingPrice : "";

            payload['zipCode'] ? propertyData['zipCode'] = payload['zipCode'] : "";
            payload['amenities'] ? propertyData['amenities'] = payload['amenities'] : "";

            payload['city'] ? propertyData['city'] = payload['city'] : "";
            payload['country'] ? propertyData['country'] = payload['country'] : "";
            payload['state'] ? propertyData['state'] = payload['state'] : "";

            payload['location'] ? propertyData['location'] = payload['location'] : "";
            payload['description'] ? propertyData['description'] = payload['description'] : "";
            payload['propertyType'] ? propertyData['propertyType'] = payload['propertyType'] : "";

            if (payload?.addressPrimary && payload?.addressSecondary) {
                propertyData['address'] = payload?.addressPrimary + ', ' + payload?.addressSecondary + ', ' + payload?.city?.cityName + ', ' + payload?.state?.name + ', ' + payload?.country?.name;
            } else {
                propertyData['address'] = payload?.addressPrimary + ', ' + payload?.city?.cityName + ', ' + payload?.state?.name + ', ' + payload?.country?.name;
            }
            if (payload.name) {
                propertyData['name'] = payload['name'];
                Promise.all([
                    PropertySpaceV1.updateEntity(
                        { propertyId: Types.ObjectId(payload.id) },
                        { propertyName: payload.name }, { multi: true }),
                    PartnerV1.updateEntity(
                        { "property._id": Types.ObjectId(payload.id) },
                        { "property.name": payload.name }, { multi: true })
                ])
            }
            return propertyData;
        } catch (error) {
            console.error(`we have an error in formatUpdatePropertyPayload ==> ${error}`);
        }
    }
}
export const AdminPropertyClaimV1 = new AdminPropertyClaimEntity(AdminPropertyModel);