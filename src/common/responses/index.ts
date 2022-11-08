/**
 * @file common/responses
 * @description exposes all the responses objects
 * @created 2019-05-15 00:15:04
 * @author Desk Now Dev Team
*/


import USER from "./user.response";
import ADMIN from "./admin.response";
import HOST from "./host.response";
import PROPERTY from "./property.response";
import AMENITIES from "./amenities.response";
import CATEGORY from "./category.response";
import PROPERTY_SPACE from "./propertySpace.response";
import LOCATION from "./location.response";

export const SUCCESS = {
    DEFAULT: {
        httpCode: 200,
        statusCode: 200,
        message: 'Success'
    },
    CAR_EDIT: {
        httpCode: 200,
        statusCode: 200,
        message: 'Car details updated successfully'
    },
    CO_HOST_ADDED: {
        httpCode: 201,
        statusCode: 201,
        message: 'Co-host added successfully'
    }
}

export const CUSTOM_ERROR = (data?: any, message?: string) => {
    return ({
        httpCode: 400,
        statusCode: 400,
        message: message ? message : "Success",
        data: data ? data : {}
    })
}

export const RESPONSE = {
    ADMIN,
    USER,
    HOST,
    PROPERTY,
    AMENITIES,
    CATEGORY,
    PROPERTY_SPACE,
    LOCATION,
}


