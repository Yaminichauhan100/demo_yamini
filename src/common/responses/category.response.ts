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
        NOT_FOUND: 'Category not found',
        CATEGORY_CREATED: 'Category created successfully',
        SUBCATEGORY_CREATED: 'Sub category created successfully',
        CATEGORY_UPDATED: 'Category updated successfully',
        ACTIVATED: 'Category activated',
        ALREADY_ACTIVE: 'Category already active',
        DE_ACTIVATED: 'Category deactivated',
        ALREADY_DE_ACTIVE: 'Category already deactivated',
        DUPLICATE_CATEGORY: 'Duplicate category',
    }
}

export default (lang: string) => ({
    NOT_FOUND: { httpCode: HTTP.NOT_FOUND, statusCode: 404, message: MSG[lang].NOT_FOUND },
    CATEGORY_CREATED: { httpCode: HTTP.SUCCESS, statusCode: 200, message: MSG[lang].CATEGORY_CREATED },
    SUBCATEGORY_CREATED: { httpCode: HTTP.SUCCESS, statusCode: 200, message: MSG[lang].SUBCATEGORY_CREATED },
    CATEGORY_UPDATED: { httpCode: HTTP.SUCCESS, statusCode: 200, message: MSG[lang].CATEGORY_UPDATED },
    ACTIVATED: { httpCode: HTTP.SUCCESS, statusCode: 200, message: MSG[lang].ACTIVATED },
    ALREADY_ACTIVE: { httpCode: HTTP.BAD_REQUEST, statusCode: 400, message: MSG[lang].ALREADY_ACTIVE },
    DE_ACTIVATED: { httpCode: HTTP.SUCCESS, statusCode: 200, message: MSG[lang].DE_ACTIVATED },
    ALREADY_DE_ACTIVE: { httpCode: HTTP.BAD_REQUEST, statusCode: 400, message: MSG[lang].ALREADY_DE_ACTIVE },
    DUPLICATE_CATEGORY: { httpCode: HTTP.BAD_REQUEST, statusCode: 400, message: MSG[lang].DUPLICATE_CATEGORY }
});