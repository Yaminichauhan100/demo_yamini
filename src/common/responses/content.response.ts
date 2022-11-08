/**
 * @name content.response
 * @description defines response for content entity
 * @created 2019-08-27 15:34:43
 * @author Desk Now Dev Team
 * @meta Response Code: 80XX
*/

import HTTP from "./code.response";

export const MSG: any = {
    en: { NOT_FOUND: 'Content not found' }
}

export default (lang: string) => ({
    NOT_FOUND: { httpCode: HTTP.NOT_FOUND, statusCode: 8001, message: MSG[lang].NOT_FOUND },
});