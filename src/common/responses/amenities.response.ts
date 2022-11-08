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
        NOT_FOUND: 'Amenity not found',
        AMENITIES_CREATED: 'Amenities created successfully',
        AMENITIES_UPDATED: 'Amenities updated successfully',
        ACTIVATED: 'Amenity activated',
        ALREADY_ACTIVE: 'Amenity already active',
        DE_ACTIVATED: 'Amenity deactivated',
        ALREADY_DE_ACTIVE: 'Amenity already deactivated',
        DUPLICATE_AMENITIES: 'Duplicate Amenities',
        FEATURED_AMENTIES_LINIT: 'Featured Amenties limit exceded'
    }
}

export default (lang: string) => ({
    NOT_FOUND: { httpCode: HTTP.NOT_FOUND, statusCode: 404, message: MSG[lang].NOT_FOUND },
    AMENITIES_CREATED: { httpCode: HTTP.SUCCESS, statusCode: 200, message: MSG[lang].AMENITIES_CREATED },
    AMENITIES_UPDATED: { httpCode: HTTP.SUCCESS, statusCode: 200, message: MSG[lang].AMENITIES_UPDATED },
    ACTIVATED: { httpCode: HTTP.SUCCESS, statusCode: 200, message: MSG[lang].ACTIVATED },
    ALREADY_ACTIVE: { httpCode: HTTP.BAD_REQUEST, statusCode: 400, message: MSG[lang].ALREADY_ACTIVE },
    DE_ACTIVATED: { httpCode: HTTP.SUCCESS, statusCode: 200, message: MSG[lang].DE_ACTIVATED },
    ALREADY_DE_ACTIVE: { httpCode: HTTP.BAD_REQUEST, statusCode: 400, message: MSG[lang].ALREADY_DE_ACTIVE },
    DUPLICATE_AMENITIES: { httpCode: HTTP.BAD_REQUEST, statusCode: 400, message: MSG[lang].DUPLICATE_AMENITIES },
    Featured_AMENITIES_LIMIT: { httpCode: HTTP.BAD_REQUEST, statusCode: 400, message: MSG[lang].FEATURED_AMENTIES_LINIT },
});