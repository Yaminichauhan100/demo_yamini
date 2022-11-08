/**
 * @name content.response
 * @description defines response for content entity
 * @created 2019-08-27 15:34:43
 * @author Desk Now Dev Team
 * @meta Response Code: 80XX
*/

import HTTP from "./code.response";

export const MSG: any = {
    en: {
        NOT_FOUND: 'City not found',
        CITY_CREATED: 'City created successfully',
        CITY_UPDATED: 'City updated successfully',
        ACTIVATED: 'City activated',
        ALREADY_ACTIVE: 'City already active',
        DE_ACTIVATED: 'City deactivated',
        ALREADY_DE_ACTIVE: 'City already deactivated'
    }
}

export default (lang: string) => ({
    NOT_FOUND: { httpCode: HTTP.NOT_FOUND, statusCode: 404, message: MSG[lang].NOT_FOUND },
    CITY_CREATED: { httpCode: HTTP.SUCCESS, statusCode: 200, message: MSG[lang].CITY_CREATED },
    CITY_UPDATED: { httpCode: HTTP.SUCCESS, statusCode: 200, message: MSG[lang].CITY_UPDATED },
    ACTIVATED: { httpCode: HTTP.SUCCESS, statusCode: 200, message: MSG[lang].ACTIVATED },
    ALREADY_ACTIVE: { httpCode: HTTP.BAD_REQUEST, statusCode: 400, message: MSG[lang].ALREADY_ACTIVE },
    DE_ACTIVATED: { httpCode: HTTP.SUCCESS, statusCode: 200, message: MSG[lang].DE_ACTIVATED },
    ALREADY_DE_ACTIVE: { httpCode: HTTP.BAD_REQUEST, statusCode: 400, message: MSG[lang].ALREADY_DE_ACTIVE }
});