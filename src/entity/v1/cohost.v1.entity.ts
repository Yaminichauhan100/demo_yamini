import { Model } from "mongoose";
import BaseEntity from "../base.entity";
import cohostModel from "@models/cohost.model";
import { handleEntityResponse } from "@baseController";
import { ENUM, RESPONSE } from "@common";
import { Types } from "mongoose";
import { HostV1 } from "./host.v1.entity";
import { PropertyV1 } from "./property.details.entity";
import { CityV1 } from "./city.v1.entity";
import { StatesV1 } from "./states.v1.entity";
import { CountriesV1 } from "./countries.v1.entity";


class CoworkersEntity extends BaseEntity {

    constructor(model: Model<any>) {
        super(model);
    }

    async addTerritory(payload: any, userId: any) {
        let coHostId: any = Types.ObjectId(payload.cohostId)
        payload.hostId = Types.ObjectId(userId)
        if (payload.propertyId && payload.propertyId.length > 0) payload.accessLevel = 4
        else if (payload.cityId && payload.cityId.length > 0) payload.accessLevel = 3
        else if (payload.stateId && payload.stateId.length > 0) payload.accessLevel = 2
        else if (payload.countryId && payload.countryId.length > 0) payload.accessLevel = 1
        await HostV1.updateDocument({ _id: coHostId }, { accessLevel: payload.accessLevel })
        let checkIfOnlyCountryLevelDataPresent = await CoHostV1.findOne({ cohostId: coHostId, accessLevel: 1 })
        if (checkIfOnlyCountryLevelDataPresent) await Promise.all([
            PropertyV1.update({ "country.id": payload.countryId, userId: payload.hostId }, { $pull: { coHostId: coHostId } }),
            CoHostV1.remove({ cohostId: coHostId, "country.id": payload.countryId })
        ])
        if (payload.accessLevel == ENUM.COHOST_LEVEL.STATUS.COUNTRY) {
            let country = []
            let countryName: any = await CountriesV1.findMany({ id: { $in: payload.countryId } }, { name: 1, id: 1, _id: 0 })
            for (let i = 0; i < countryName.length; i++)  country.push(countryName[i])
            payload.country = country
            let countryData: any = await CoHostV1.findOne({ cohostId: coHostId, "country.id": { $in: payload.countryId }, "accessLevel": { $ne: 1 } })
            if (!countryData) {
                let cohostData = await Promise.all([
                    CoHostV1.updateDocument({ cohostId: coHostId, "country.id": { $in: payload.countryId } }, payload, { upsert: true, new: true }),
                    PropertyV1.update({ "country.id": { $in: payload.countryId }, userId: payload.hostId }, { $addToSet: { coHostId: coHostId } })
                ])
                return cohostData[0]
            } else {
                await CoHostV1.removeAll({ cohostId: coHostId, "country.id": { $in: payload.countryId } })
                let cohostData = await Promise.all([
                    CoHostV1.updateDocument({ cohostId: coHostId, "country.id": { $in: payload.countryId } }, payload, { upsert: true, new: true }),
                    PropertyV1.update({ "country.id": { $in: payload.countryId }, userId: payload.hostId }, { $addToSet: { coHostId: coHostId } })
                ])
                return cohostData[0]
            }
        }
        else if (payload.accessLevel == ENUM.COHOST_LEVEL.STATUS.STATE) {

            let country = []
            let state = []
            let [stateName, countryName]: any = await Promise.all([
                StatesV1.findMany({ id: { $in: payload.stateId } }, { name: 1, id: 1, _id: 0 }),
                CountriesV1.findMany({ id: { $in: payload.countryId } }, { name: 1, id: 1, _id: 0 })
            ])
            for (let i = 0; i < stateName.length; i++) state.push(stateName[i])
            for (let i = 0; i < countryName.length; i++)  country.push(countryName[i])
            payload.state = state
            payload.country = country
            payload.city = []
            payload.property = []
            let stateData: any = await CoHostV1.findOne({ cohostId: coHostId, "country.id": { $in: payload.countryId }, "state.id": { $in: payload.stateId } })
            if (!stateData) {
                let findStaateLevelTwoPresent: any = await CoHostV1.findOne({ cohostId: coHostId, "country.id": { $in: payload.countryId }, accessLevel: 2 })
                if (findStaateLevelTwoPresent) {
                    let cohostData = await Promise.all([
                        CoHostV1.updateOne({ _id: findStaateLevelTwoPresent._id }, { $addToSet: { state: payload.state } }),
                        PropertyV1.update({ "state.id": { $in: payload.stateId }, userId: payload.hostId }, { $addToSet: { coHostId: coHostId } })

                    ])
                    return cohostData[0]
                } else {
                    await PropertyV1.update({ "country.id": payload.countryId, userId: payload.hostId, "state.id": { $in: payload.stateId } }, { $pull: { coHostId: coHostId } })
                    let cohostData = await Promise.all([
                        CoHostV1.updateDocument({ cohostId: coHostId, "country.id": { $in: payload.countryId }, "state.id": { $in: payload.stateId } }, payload, { upsert: true, new: true }),
                        PropertyV1.update({ "state.id": payload.stateId, userId: payload.hostId }, { $addToSet: { coHostId: coHostId } })
                    ])
                    return cohostData[1]
                }
            } else {
                if (stateData.accessLevel == 2) {
                    if (stateData.state.length > 1) {
                        let cohostData = await Promise.all([
                            CoHostV1.updateOne({ cohostId: coHostId, "country.id": { $in: payload.countryId }, "state.id": { $in: payload.stateId } }, { $addToSet: { state: payload.state } }, { upsert: true }),
                            PropertyV1.update({ "state.id": payload.stateId, userId: payload.hostId }, { $addToSet: { coHostId: [coHostId] } })
                        ])
                        return cohostData[0]
                    } else {
                        let cohostData = await Promise.all([
                            CoHostV1.updateDocument({ cohostId: coHostId }, payload, { upsert: true, new: true }),
                            CoHostV1.remove({ cohostId: coHostId, "state.id": payload.stateId, accessLevel: { $in: [3, 4] } }),
                            PropertyV1.update({ "state.id": payload.stateId, userId: payload.hostId }, { $addToSet: { coHostId: coHostId } })
                        ])
                        return cohostData[0]
                    }
                } else {
                    let stateWithLevel2: any = await CoHostV1.findOne({ cohostId: coHostId, "country.id": { $in: payload.countryId }, accessLevel: 2 })
                    if (stateWithLevel2) {
                        await CoHostV1.remove({ cohostId: coHostId, "state.id": payload.stateId, accessLevel: { $in: [3, 4] } })
                        let cohostData = await Promise.all([
                            CoHostV1.updateOne({ _id: stateWithLevel2._id }, { $addToSet: { state: payload.state } }),
                            PropertyV1.update({ "state.id": payload.stateId, userId: payload.hostId }, { $addToSet: { coHostId: coHostId } })
                        ])
                        return cohostData[0]
                    } else {
                        await CoHostV1.removeAll({ cohostId: coHostId, "state.id": payload.stateId, accessLevel: { $in: [3, 4] } })
                        let cohostData = await Promise.all([
                            CoHostV1.updateDocument({ _id: stateData._id }, payload, { upsert: true, new: true }),
                            PropertyV1.update({ "state.id": payload.stateId, userId: payload.hostId }, { $addToSet: { coHostId: coHostId } })
                        ])
                        return cohostData[0]
                    }

                }
            }
        }
        else if (payload.accessLevel == ENUM.COHOST_LEVEL.STATUS.CITY) {
            let country = []
            let state = []
            let city = []
            let [stateName, countryName, cityName]: any = await Promise.all([
                StatesV1.findMany({ id: { $in: payload.stateId } }, { name: 1, id: 1, _id: 0 }),
                CountriesV1.findMany({ id: { $in: payload.countryId } }, { name: 1, id: 1, _id: 0 }),
                CityV1.findMany({ _id: { $in: payload.cityId } }, { cityName: 1, _id: 1 }),

            ])
            for (let i = 0; i < stateName.length; i++) state.push(stateName[i])
            for (let i = 0; i < countryName.length; i++)  country.push(countryName[i])
            for (let i = 0; i < cityName.length; i++) {
                city.push(cityName[i])
                payload.cityId[i] = Types.ObjectId(payload.cityId[i])
            }

            payload.state = state
            payload.country = country
            payload.city = city
            let stateData: any = await CoHostV1.findOne({ cohostId: coHostId, "country.id": { $in: payload.countryId }, "city._id": { $in: payload.cityId } })
            if (!stateData) {
                let findStaateLevelTwoPresent: any = await CoHostV1.findOne({ cohostId: coHostId, "state.id": { $in: payload.stateId }, accessLevel: { $ne: 4 } })
                if (findStaateLevelTwoPresent) {
                    if (findStaateLevelTwoPresent.state.length > 1) {
                        await PropertyV1.update({ "state.id": { $in: payload.stateId }, userId: payload.hostId }, { $pull: { coHostId: coHostId } })
                        await CoHostV1.updateOne({ _id: Types.ObjectId(findStaateLevelTwoPresent._id) }, { $pull: { state: payload.state[0] } })
                        let cohostData = await Promise.all([
                            CoHostV1.updateOne({ cohostId: coHostId, "city._id": { $in: payload.cityId } }, payload, { upsert: true }),
                            PropertyV1.update({ "city._id": { $in: payload.cityId }, userId: payload.hostId }, { $addToSet: { coHostId: coHostId } })
                        ])
                        return cohostData[1]
                    } else {
                        await PropertyV1.update({ "state.id": { $in: payload.stateId }, userId: payload.hostId }, { $pull: { coHostId: coHostId } })
                        let cohostData = await Promise.all([
                            CoHostV1.updateOne({ _id: Types.ObjectId(findStaateLevelTwoPresent._id) }, { $addToSet: { city: payload.city }, accessLevel: 3 }),
                            PropertyV1.update({ "city._id": { $in: payload.cityId }, userId: payload.hostId }, { $addToSet: { coHostId: coHostId } })

                        ])
                        return cohostData[0]
                    }
                } else {
                    await PropertyV1.update({ "country.id": { $in: payload.countryId }, userId: payload.hostId, "city._id": { $in: payload.cityId } }, { $pull: { coHostId: coHostId } })
                    await CoHostV1.remove({ cohostId: coHostId, "country.id": { $in: payload.countryId }, accessLevel: 1 })
                    let cohostData = await Promise.all([
                        CoHostV1.updateDocument({ cohostId: coHostId, "state.id": { $in: payload.stateId }, accessLevel: { $ne: 4 } }, payload, { upsert: true }),
                        PropertyV1.update({ "city._id": { $in: payload.cityId }, userId: payload.hostId }, { $addToSet: { coHostId: coHostId } })
                    ])
                    return cohostData[1]

                }
            } else {
                //incase properties inside cities level
                if (stateData.accessLevel == 3) {
                    if (stateData.city.length > 1) {
                        let cohostData = await Promise.all([
                            CoHostV1.updateOne({ cohostId: coHostId, "country.id": { $in: payload.countryId }, "city._id": { $in: payload.cityId } }, { $addToSet: { city: payload.city } }, { upsert: true }),
                            PropertyV1.update({ "city._id": payload.stateId, userId: payload.hostId }, { $addToSet: { coHostId: [coHostId] } })
                        ])
                        return cohostData[0]
                    } else {
                        let cohostData = await Promise.all([
                            CoHostV1.updateDocument({ cohostId: coHostId, "country.id": { $in: payload.countryId } }, payload, { upsert: true, new: true }),
                            PropertyV1.update({ "city._id": payload.stateId, userId: payload.hostId }, { $addToSet: { coHostId: [coHostId] } })
                        ])
                        return cohostData[0]
                    }

                } else {
                    await CoHostV1.remove({ _id: Types.ObjectId(stateData._id) })
                    let cohostData = await Promise.all([
                        CoHostV1.updateDocument({ cohostId: coHostId, "country.id": { $in: payload.countryId }, "city._id": { $in: payload.cityId } }, payload, { upsert: true, new: true }),
                        PropertyV1.update({ "city._id": payload.cityId, userId: payload.hostId }, { $addToSet: { coHostId: [coHostId] } })
                    ])
                    return cohostData[0]
                }
            }

        }
        else if (payload.accessLevel == ENUM.COHOST_LEVEL.STATUS.PROPERTY) {
            let country = []
            let state = []
            let city = []
            let property = []
            let [stateName, countryName, cityName, propertyName]: any = await Promise.all([
                StatesV1.findMany({ id: { $in: payload.stateId } }, { name: 1, id: 1, _id: 0 }),
                CountriesV1.findMany({ id: { $in: payload.countryId } }, { name: 1, id: 1, _id: 0 }),
                CityV1.findMany({ _id: { $in: payload.cityId } }, { cityName: 1, _id: 1 }),
                PropertyV1.findMany({ _id: { $in: payload.propertyId } }, { name: 1, _id: 1 }),
            ])
            for (let i = 0; i < stateName.length; i++) state.push(stateName[i])
            for (let i = 0; i < countryName.length; i++)  country.push(countryName[i])
            for (let i = 0; i < cityName.length; i++) {
                city.push(cityName[i])
                payload.cityId[i] = Types.ObjectId(payload.cityId[i])
            }
            for (let i = 0; i < propertyName.length; i++) {
                property.push(propertyName[i])
                payload.propertyId[i] = Types.ObjectId(payload.propertyId[i])
            }
            payload.state = state
            payload.country = country
            payload.city = city
            payload.property = property
            let propertyData: any = await CoHostV1.findOne({ cohostId: coHostId, "country.id": { $in: payload.countryId }, "property._id": { $in: payload.propertyId } })
            if (!propertyData) {
                let findStaateLevelTwoPresent: any = await CoHostV1.findOne({ cohostId: coHostId, "city._id": { $in: payload.cityId } })
                if (findStaateLevelTwoPresent) {
                    if (findStaateLevelTwoPresent.city.length > 1) {
                        await PropertyV1.update({ "city._id": { $in: payload.cityId }, userId: payload.hostId }, { $pull: { coHostId: coHostId } })
                        await CoHostV1.updateOne({ _id: findStaateLevelTwoPresent._id }, { $pull: { city: payload.city[0] } })
                        let cohostData = await Promise.all([
                            CoHostV1.updateOne({ cohostId: coHostId, "property._id": { $in: payload.propertyId } }, payload, { upsert: true }),
                            PropertyV1.update({ "_id": { $in: payload.propertyId }, userId: payload.hostId }, { $addToSet: { coHostId: coHostId } })
                        ])
                        return cohostData[1]
                    } else {
                        await PropertyV1.update({ "city._id": { $in: payload.cityId }, userId: payload.hostId }, { $pull: { coHostId: coHostId } })
                        let cohostData = await Promise.all([
                            CoHostV1.updateOne({ _id: findStaateLevelTwoPresent._id }, { $addToSet: { property: payload.property }, accessLevel: 4 }),
                            PropertyV1.update({ "_id": { $in: payload.propertyId }, userId: payload.hostId }, { $addToSet: { coHostId: coHostId } })

                        ])
                        return cohostData[0]
                    }
                } else {
                    let findStaateLevelTwoPresent: any = await CoHostV1.findOne({ cohostId: coHostId, "state.id": { $in: payload.stateId } })
                    if (findStaateLevelTwoPresent) {
                        if (findStaateLevelTwoPresent.state.length > 1) {
                            await PropertyV1.update({ "country.id": { $in: payload.countryId }, userId: payload.hostId, "state.id": { $in: payload.stateId } }, { $pull: { coHostId: coHostId } })
                            await CoHostV1.updateOne({ _id: findStaateLevelTwoPresent._id }, { $pull: { state: payload.state[0] } })
                            let cohostData = await Promise.all([
                                CoHostV1.updateOne({ cohostId: coHostId, "property._id": { $in: payload.propertyId } }, payload, { upsert: true }),
                                PropertyV1.update({ "_id": { $in: payload.propertyId }, userId: payload.hostId }, { $addToSet: { coHostId: coHostId } })

                            ])
                            return cohostData[1]
                        } else {
                            await PropertyV1.update({ "country.id": { $in: payload.countryId }, userId: payload.hostId, "state.id": { $in: payload.stateId } }, { $pull: { coHostId: coHostId } })
                            let cohostData = await Promise.all([
                                CoHostV1.updateOne({ _id: findStaateLevelTwoPresent._id }, payload, { upsert: true }),
                                PropertyV1.update({ "_id": { $in: payload.propertyId }, userId: payload.hostId }, { $addToSet: { coHostId: coHostId } })

                            ])
                            return cohostData[1]
                        }
                    } else {
                        await CoHostV1.remove({ cohostId: coHostId, "country.id": { $in: payload.countryId }, accessLevel: 1 })
                        let cohostData = await Promise.all([
                            CoHostV1.updateDocument({ cohostId: coHostId, "country.id": { $in: payload.countryId }, "property._id": { $in: payload.propertyId } }, payload, { upsert: true }),
                            PropertyV1.update({ "_id": { $in: payload.propertyId }, userId: payload.hostId }, { $addToSet: { coHostId: coHostId } })
                        ])
                        return cohostData[1]

                    }
                }
            } else {
                return propertyData
            }


        }
    }

    async createCohost(payload: any, userId: any): Promise<IUser.User> {
        let query: any
        let propertyQuery: any
        let cohostQuery: any
        payload.hostId = userId


        let state: any = [], country: any = [], city: any = [], property: any = []

        if (payload && payload.propertyId && payload.propertyId.length > 0) {
            let [cityName, stateName, countryName, propertyName]: any = await Promise.all([
                CityV1.findMany({ _id: { $in: payload.cityId } }, { cityName: 1, _id: 1 }),
                StatesV1.findMany({ id: { $in: payload.stateId } }, { name: 1, id: 1, _id: 0 }),
                CountriesV1.findMany({ id: { $in: payload.countryId } }, { name: 1, id: 1, _id: 0 }),
                PropertyV1.findMany({ _id: { $in: payload.propertyId } }, { name: 1, _id: 1 }),
            ])
            for (let i = 0; i < stateName.length; i++) state.push(stateName[i]);
            for (let i = 0; i < countryName.length; i++)  country.push(countryName[i]);
            for (let i = 0; i < cityName.length; i++)  city.push(cityName[i]);
            for (let i = 0; i < propertyName.length; i++)  property.push(propertyName[i]);
            payload.city = city
            payload.state = state
            payload.country = country
            payload.property = property
            payload.accessLevel = ENUM.COHOST_LEVEL.STATUS.PROPERTY
            cohostQuery = CoHostV1.updateDocument({ cohostId: Types.ObjectId(payload.cohostId), "country.id": { $in: payload.countryId } }, payload, { upsert: true })
            query = HostV1.updateDocument({ _id: Types.ObjectId(payload.cohostId) }, { accessLevel: ENUM.COHOST_LEVEL.STATUS.PROPERTY })
            propertyQuery = PropertyV1.update({ _id: { $in: payload.propertyId } }, { $push: { coHostId: Types.ObjectId(payload.cohostId) } }, { multi: true })
        }
        else if (payload && payload.cityId && payload.cityId.length > 0) {
            let state: any = [], country: any = [], city: any = []
            let [cityName, stateName, countryName]: any = await Promise.all([
                CityV1.findMany({ _id: { $in: payload.cityId } }, { cityName: 1, _id: 1 }),
                StatesV1.findMany({ id: { $in: payload.stateId } }, { name: 1, _id: 0, id: 1 }),
                CountriesV1.findMany({ id: { $in: payload.countryId } }, { name: 1, _id: 0, id: 1 }),
            ])
            for (let i = 0; i < stateName.length; i++) state.push(stateName[i])
            for (let i = 0; i < countryName.length; i++)  country.push(countryName[i])
            for (let i = 0; i < cityName.length; i++)  city.push(cityName[i])
            payload.city = city
            payload.state = state
            payload.country = country
            payload.property = []
            payload.accessLevel = ENUM.COHOST_LEVEL.STATUS.CITY
            query = HostV1.updateDocument({ _id: Types.ObjectId(payload.cohostId) }, { accessLevel: ENUM.COHOST_LEVEL.STATUS.CITY })
            propertyQuery = PropertyV1.update({ "city._id": { $in: payload.cityId }, userId: userId }, { $push: { coHostId: Types.ObjectId(payload.cohostId) } }, { multi: true })
            cohostQuery = CoHostV1.updateDocument({ cohostId: Types.ObjectId(payload.cohostId), "country.id": { $in: payload.countryId } }, payload, { upsert: true })
        }
        else if (payload && payload.stateId && payload.stateId.length > 0) {
            let state: any = [], country: any = []
            let [stateName, countryName]: any = await Promise.all([
                StatesV1.findMany({ id: { $in: payload.stateId } }, { name: 1, _id: 0, id: 1 }),
                CountriesV1.findMany({ id: { $in: payload.countryId } }, { name: 1, _id: 0, id: 1 }),
            ])
            for (let i = 0; i < stateName.length; i++) state.push(stateName[i])
            for (let i = 0; i < countryName.length; i++)  country.push(countryName[i])
            payload.country = country
            payload.state = state
            payload.city = []
            payload.property = []

            payload.accessLevel = ENUM.COHOST_LEVEL.STATUS.STATE

            query = HostV1.updateDocument({ _id: Types.ObjectId(payload.cohostId) }, { accessLevel: ENUM.COHOST_LEVEL.STATUS.STATE })
            propertyQuery = PropertyV1.update({ "state.id": { $in: payload.stateId }, userId: userId }, { $push: { coHostId: Types.ObjectId(payload.cohostId) } }, { multi: true })
            cohostQuery = CoHostV1.updateDocument({ cohostId: Types.ObjectId(payload.cohostId), "country.id": { $in: payload.countryId } }, payload, { upsert: true })
        }
        else if (payload && payload.countryId) {
            let country: any = await CountriesV1.findOne({ id: { $in: payload.countryId } }, { name: 1, _id: 0, id: 1 })
            payload.country = country
            payload.state = []
            payload.city = []
            payload.property = []
            payload.accessLevel = ENUM.COHOST_LEVEL.STATUS.COUNTRY
            query = HostV1.updateDocument({ _id: Types.ObjectId(payload.cohostId) }, { accessLevel: ENUM.COHOST_LEVEL.STATUS.COUNTRY })
            propertyQuery = PropertyV1.update({ "country.id": { $in: payload.countryId }, userId: userId }, { $push: { coHostId: Types.ObjectId(payload.cohostId) } }, { multi: true })
            cohostQuery = CoHostV1.updateDocument({ cohostId: Types.ObjectId(payload.cohostId), "country.id": { $in: payload.countryId } }, payload, { upsert: true })
        }

        let cohostData = await Promise.all([
            cohostQuery,
            query,
            propertyQuery,
        ])
        return cohostData[0];
    }

    async checkAccessLevels(res: any, payload: any): Promise<any> {
        try {
            if (res?.locals?.userData?.isCohost && res?.locals?.userData?.accessLevel == ENUM.COHOST_LEVEL.STATUS.PROPERTY) {
                return handleEntityResponse.sendResponse(res, RESPONSE.PROPERTY(res.locals.lang).NOT_ALLOWED);
            }
            else if (res?.locals?.userData?.isCohost) {
                payload['userId'] = Types.ObjectId(res.locals.userData.hostId);
                return payload;
            }
            else {
                payload['userId'] = Types.ObjectId(res.locals.userId);
                return payload;
            }
        } catch (error) {
            console.error(`we have an error while checkAccessLevels ==> ${error}`);
        }
    }
}

export const CoHostV1 = new CoworkersEntity(cohostModel);
