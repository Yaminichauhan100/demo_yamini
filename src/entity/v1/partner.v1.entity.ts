import { Model, Types } from "mongoose";

import BaseEntity from "../base.entity";
import PartnerModel from "@models/partner.model";
import { StatesV1 } from "./states.v1.entity";
import { CountriesV1 } from "./countries.v1.entity";
import { PropertyV1 } from "./property.details.entity";
import { UserV1, EmployeeV1 } from "@entity";
import { CityV1 } from "./city.v1.entity";
import { PartnerFloorV1 } from "./partner.floor.entity";
import { PropertySpaceV1 } from "./property.spaces.v1.entity";
import { ENUM, employeeSignupTemplater, FORMAT, CONSTANT } from "@common";
import { Mailer, S3Invoice } from "@services";
import { HostV1 } from "./host.v1.entity";
const xl = require('excel4node');
import { TEMPLATER } from "../../htmlHelper";
class PartnerEntity extends BaseEntity {

    constructor(model: Model<any>) {
        super(model);
    }

    async savePartner(payload: any) {

        try {
            let [state, country, city, property]: any = await Promise.all([StatesV1.findOne({ id: payload.stateId }, { id: 1, name: 1 }),
            CountriesV1.findOne({ id: payload.countryId }, { id: 1, name: 1 }),
            CityV1.findOne({ _id: Types.ObjectId(payload.cityId) }, { _id: 1, cityName: 1 }),
            PropertyV1.findOne({ _id: Types.ObjectId(payload.propertyId) }, { _id: 1, name: 1 })
            ])

            payload.state = state;
            payload.country = country;
            payload.city = city;
            payload.property = property;
            if (payload.floorDetails && payload.floorDetails.length == 0) {
                payload.partnerType = ENUM.PROPERTY.PROPERTY_TYPE.ENTIRE_BUILDING
            } else {
                payload.partnerType = ENUM.PROPERTY.PROPERTY_TYPE.SPECIFIC_FLOOR
            }
            let partner: any = await new this.model(payload).save();
            payload.partnerId = partner._id
            if (payload.floorDetails && payload.floorDetails.length > 0) await this.saveFloorDetails(payload)
            return partner.toObject();
        } catch (error) {
            console.error("we have an error in =>>>>>>>>>>>>>>>>>>>>> savePartner", error)
        }
    }


    async saveFloorDetails(payload: any) {
        try {
            for (let floorNumber = 0; floorNumber < payload.floorDetails.length; floorNumber++) {
                payload.floorDetails[floorNumber].partnerId = payload.partnerId
                await this.addPartnerFloor(payload.floorDetails[floorNumber]);
            }
        } catch (error) {
            console.error("we have an error in =>>>>>>>>>>>>>>>>>>>>> saveFloorDetails", error)
        }
    }


    async addPartnerFloor(payload: any) {
        try {
            let floorData = await PropertySpaceV1.updateDocument({ _id: Types.ObjectId(payload.spaceId) }, { partnerId: Types.ObjectId(payload.partnerId) })
            return floorData;
        } catch (error) {
            console.error("we have an error in =>>>>>>>>>>>>>>>>>>>>> addPartnerFloor", error)
            return error
        }
    }

    async updateFloorDetails(payload: any) {
        try {
            for (let floorNumber = 0; floorNumber < payload.floorDetails.length; floorNumber++) {
                payload.floorDetails[floorNumber].partnerId = payload.partnerId
                await this.updatePartnerFloor(payload.floorDetails[floorNumber]);
            }
        } catch (error) {
            console.error("we have an error in =>>>>>>>>>>>>>>>>>>>>> updateFloorDetails", error)
        }
    }

    async updatePartnerFloor(payload: any) {
        try {
            let floorData = await PropertySpaceV1.updateDocument({ _id: Types.ObjectId(payload.spaceId) }, { partnerId: Types.ObjectId(payload.partnerId) })
            return floorData;
        } catch (error) {
            console.error("we have an error in =>>>>>>>>>>>>>>>>>>>>> updatePartnerFloor", error)
            return error

        }
    }

    async checkFloorAvailabilityWhileAdding(payload: any) {
        try {
            for (let floorNumber = 0; floorNumber < payload.floorDetails.length; floorNumber++) {
                let findFloorNumberFromSpace: any = await PropertySpaceV1.findOne({ _id: Types.ObjectId(payload.floorDetails[floorNumber].spaceId) }, { floorNumber: 1 })
                if (findFloorNumberFromSpace) {
                    let searchPartnerFLoorDetails: any = await PartnerV1.findOne({ "property._id": Types.ObjectId(payload.propertyId), partnerFloors: findFloorNumberFromSpace.floorNumber }, {})
                    if (searchPartnerFLoorDetails) return findFloorNumberFromSpace.floorNumber
                    else return searchPartnerFLoorDetails
                }
                return findFloorNumberFromSpace
            }
        } catch (error) {
            console.error("error in check floor availability function in partner entity", error);
        }
    }


    async checkFloorAvailabilityWhileUpdatingPartner(payload: any) {
        try {
            for (let floorNumber = 0; floorNumber < payload.floorDetails.length; floorNumber++) {
                let findFloorNumberFromSpace: any = await PropertySpaceV1.findOne({ _id: Types.ObjectId(payload.floorDetails[floorNumber].spaceId) }, { floorNumber: 1 })
                let searchPartnerFLoorDetails: any = await PartnerV1.findOne({ "property._id": Types.ObjectId(payload.propertyId), partnerFloors: findFloorNumberFromSpace.floorNumber, _id: { $ne: Types.ObjectId(payload.partnerId) } }, {})
                if (searchPartnerFLoorDetails) { return findFloorNumberFromSpace.floorNumber }
            }
        } catch (error) {
            console.error("error in check floor availability function in partner entity", error)
        }
    }

    async checkFloorAvailabilityWhileUpdating(payload: any) {
        try {
            if (payload.partnerFloors && payload.partnerFloors.length > 0) {
                let partnerFloors: any = await Promise.all([
                    PartnerFloorV1.distinct("floorNumber", { partnerId: Types.ObjectId(payload.partnerId), status: ENUM.PROPERTY.STATUS.ACTIVE, floorNumber: { $in: payload.partnerFloors } }),
                    PartnerFloorV1.distinct("_id", { partnerId: Types.ObjectId(payload.partnerId), status: ENUM.PROPERTY.STATUS.ACTIVE, floorNumber: { $in: payload.partnerFloors } })
                ])
                let partnerArray: any = [];
                partnerFloors[1].forEach((element: any) => {
                    partnerArray.push(Types.ObjectId(element))
                });

                await Promise.all([
                    PartnerFloorV1.removeAll({ _id: { $in: partnerArray } }),
                    PartnerV1.updateOne({ _id: Types.ObjectId(payload.partnerId) }, { $pull: { partnerFloors: { $in: partnerFloors[0] } } })
                ])
            }

            if (payload.floorDetails && payload.floorDetails.length > 0) {
                for (let floorNumber = 0; floorNumber < payload.floorDetails.length; floorNumber++) {
                    let floorSpaceNumber: any = await PropertySpaceV1.findOne({ _id: Types.ObjectId(payload.floorDetails[floorNumber].spaceId) }, { floorNumber: 1 })
                    await PartnerV1.updateOne({ _id: Types.ObjectId(payload.partnerId) }, { $pull: { partnerFloors: floorSpaceNumber.floorNumber } })
                }
            }
            return;
        } catch (error) {
            console.error("error in check floor availability function in partner entity", error)
        }
    }

    async updatePartner(payload: any) {
        try {
            if (payload.stateId) payload.state = await StatesV1.findOne({ id: payload.stateId }, { id: 1, name: 1 })

            if (payload.countryId) payload.country = await CountriesV1.findOne({ id: payload.countryId }, { id: 1, name: 1 })

            if (payload.cityId) payload.city = await CityV1.findOne({ _id: Types.ObjectId(payload.cityId) }, { _id: 1, cityName: 1 })

            if (payload.propertyId) {
                payload.property = await PropertyV1.findOne({ _id: Types.ObjectId(payload.propertyId) }, { _id: 1, name: 1 })
                await EmployeeV1.updateEntity({ partnerId: Types.ObjectId(payload.partnerId) }, { propertyId: Types.ObjectId(payload.propertyId) }, { multi: true })
            }
            payload.status = ENUM.PROPERTY.STATUS.ACTIVE
            let response = await PartnerV1.updateDocument({ _id: Types.ObjectId(payload.partnerId) }, payload)

            await PropertySpaceV1.update({ partnerId: Types.ObjectId(payload.partnerId) }, { $unset: { partnerId: "" } }, { multi: true })

            if (payload.floorDetails && payload.floorDetails.length > 0) {
                await this.saveFloorDetails(payload)
            }

            return response
        } catch (error) {
            console.error("error in updatePartner", error)
            return 0
        }

    }
    async bulkEmployee(payload: any, partnerId: string) {
        try {
            {
                let status = []
                let finalDataToWriteFile = [];
                let findHostEmail: any
                for (let i = 0; i < payload.length; i++) {
                    let dataToWrite: any = {};
                    let [searchDuplicateUser, findProperty]: any = await Promise.all([
                        UserV1.findOne({ $or: [{ email: payload[i].email }, { phoneNo: payload[i].phoneNo, countryCode: payload[i].countryCode }] }),
                        PartnerV1.findOne({ _id: Types.ObjectId(partnerId) }, { property: 1, name: 1, hostId: 1 })
                    ])

                    findHostEmail = await HostV1.findOne({ _id: Types.ObjectId(findProperty.hostId) }, { email: 1, name: 1 });

                    payload[i].propertyId = Types.ObjectId(findProperty.property._id);

                    if (searchDuplicateUser) {
                        let searchDuplicateEmployee: any = await EmployeeV1.findOne({ partnerId: Types.ObjectId(partnerId), $or: [{ email: payload[i].email }, { phoneNo: payload[i].phoneNo, countryCode: payload[i].countryCode }] })
                        if (payload[i].phoneNo.toString().length > 14 || payload[i].phoneNo.toString().length < 8 || payload[i].phoneNo.toString()[0] === '0') {
                            dataToWrite = payload[i];
                            dataToWrite.status = "failure";
                            finalDataToWriteFile.push(dataToWrite);
                            status.push("failure" + payload[i].name)
                            continue;
                        }
                        else if (searchDuplicateEmployee) {
                            dataToWrite = payload[i];
                            dataToWrite.status = "failure";
                            finalDataToWriteFile.push(dataToWrite);
                            status.push("failure" + payload[i].name)
                            continue;
                        }
                        else {
                            payload[i].userId = Types.ObjectId(searchDuplicateUser._id)
                            payload[i].partnerId = Types.ObjectId(partnerId)
                            await Promise.all([UserV1.update({ _id: Types.ObjectId(searchDuplicateUser._id) }, { $addToSet: { partnerId: partnerId } }),
                            EmployeeV1.create(payload[i]),
                            PartnerV1.updateOne({ _id: Types.ObjectId(partnerId) }, { $inc: { totalEmployees: 1 } })
                            ])
                            dataToWrite = payload[i];
                            dataToWrite.status = "success";
                            finalDataToWriteFile.push(dataToWrite);
                            status.push("success" + payload[i].name)
                            let html = await employeeSignupTemplater(payload[i], findProperty.name)
                            Mailer.sendMail(FORMAT.EMAIL.USER.NEW_SIGNUP_EMAIL(payload[i].email, html));
                            continue;
                        }
                    }
                    let searchDuplicateEmployee: any = await EmployeeV1.findOne({ partnerId: Types.ObjectId(partnerId), $or: [{ email: payload[i].email }, { phoneNo: payload[i].phoneNo, countryCode: payload[i].countryCode }] })
                    if (payload[i].phoneNo.toString().length > 14 || payload[i].phoneNo.toString().length < 8 || payload[i].phoneNo.toString()[0] === '0') {
                        dataToWrite = payload[i];
                        dataToWrite.status = "failure";
                        finalDataToWriteFile.push(dataToWrite);
                        status.push("failure" + payload[i].name)
                        continue;
                    }
                    else if (searchDuplicateEmployee) {
                        dataToWrite = payload[i];
                        dataToWrite.status = "failure";
                        finalDataToWriteFile.push(dataToWrite);
                        status.push("failure" + payload[i].name)
                        continue;
                    }
                    else {
                        payload[i].partnerId = Types.ObjectId(partnerId)
                        await Promise.all([
                            PartnerV1.updateOne({ _id: Types.ObjectId(partnerId) }, { $inc: { totalEmployees: 1 } }),
                            EmployeeV1.create(payload[i])
                        ])
                        dataToWrite = payload[i];
                        dataToWrite.status = "success";
                        finalDataToWriteFile.push(dataToWrite);
                        status.push("success" + payload[i].name)
                        let html = await employeeSignupTemplater(payload[i], findProperty.name)
                        Mailer.sendMail(FORMAT.EMAIL.USER.NEW_SIGNUP_EMAIL(payload[i].email, html));
                        continue;
                    }
                }
                const generatedSheetDetail = await this.generateExcelFile(finalDataToWriteFile);

                let html = await TEMPLATER.makeHtmlTemplate(process.cwd() + `/src/views/Bulk employee/employee_bulk_upload.html`, {
                    logo: CONSTANT.VERIFY_EMAIL_LOGO,
                    hostName: findHostEmail ?.name,
                    facebookLogo: CONSTANT.FACEBOOK_LOGO_PNG,
                    igLogo: CONSTANT.INSTAGRAM_LOGO,
                    twitterLogo: CONSTANT.TWITTER_LOGO_NEW,
                    linkedinLogo: CONSTANT.LINKEDIN_LOGO,
                    welcome: "DeskNow",
                    webPanelUrl: CONSTANT.EMAILER_URLS.WEB_PANEL,
                    contactUsUrl: CONSTANT.EMAILER_URLS.CONTACT_US,
                    FAQUrl: CONSTANT.EMAILER_URLS.FAQUrl,

                });
                //Mailer.sendMail(FORMAT.EMAIL.USER.EMPLOYEE_SHEET_EMAIL(findHostEmail.email, html, [{ fileName: "Employee Status", path: `${process.cwd()}/uploads/${generatedSheetDetail}` }]));
                setTimeout(async () => {
                    let s3Object = await S3Invoice.uploadExcel(
                        `${generatedSheetDetail}`,
                        `${process.cwd()}/public/invoices/${generatedSheetDetail}`
                    );
                    if (s3Object ?.LocationUrl) {
                        Mailer.sendMail(FORMAT.EMAIL.USER.EMPLOYEE_SHEET_EMAIL(findHostEmail.email, html, [{ fileName: "Employee Status", path: `${process.cwd()}/uploads/${generatedSheetDetail}` }]));
                    }
                }, 1000);


                return
            }
        } catch (error) {
            console.error("error in bulkEmployee", error)
        }
    }

    async generateExcelFile(fileData: any) {
        try {
            const createSheet = () => {
                return new Promise(resolve => {
                    // setup workbook and sheet
                    var wb = new xl.Workbook();

                    var ws = wb.addWorksheet('Sheet');

                    // Add a title row

                    ws.cell(1, 1)
                        .string('name')

                    ws.cell(1, 2)
                        .string('email')

                    ws.cell(1, 3)
                        .string('phoneNo')

                    ws.cell(1, 4)
                        .string('countryCode')

                    ws.cell(1, 5)
                        .string('status')

                    // add data from json

                    for (let i = 0; i < fileData.length; i++) {

                        let row = i + 2

                        ws.cell(row, 1)
                            .string(fileData[i].name)

                        ws.cell(row, 2)
                            .string(fileData[i].email)

                        ws.cell(row, 3)
                            .number(fileData[i].phoneNo)

                        ws.cell(row, 4)
                            .number(fileData[i].countryCode)

                        ws.cell(row, 5)
                            .string(fileData[i].status)
                    }

                    resolve(wb)

                })
            }

            //misses buffer implementation
            const sheetDetail: any = await createSheet();
            const fileName: any = `${+new Date()}.xlsx`;
            sheetDetail.write(`./public/invoices/${fileName}`);
            return fileName;
        } catch (error) {
            console.error(`we have an error in generateExcelFile method => ${error}`);
        }
    }

}

export const PartnerV1 = new PartnerEntity(PartnerModel);
