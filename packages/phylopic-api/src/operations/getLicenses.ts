import CORS_HEADERS from "../headers/CORS_HEADERS"
import createETagCacheHeaders from "../headers/createETagCacheHeaders"
import DATA_HEADERS from "../headers/DATA_HEADERS"
import checkAccept from "../mediaTypes/checkAccept"
import DATA_MEDIA_TYPE from "../mediaTypes/DATA_MEDIA_TYPE"
import create304 from "../utils/aws/create304"
import matchesETag from "../utils/http/matchesETag"
import { Operation } from "./Operation"
export interface GetLicensesParameters {
    readonly accept?: string
    readonly "if-none-match"?: string
}
const BODY =
    '[{"href":"https://creativecommons.org/publicdomain/zero/1.0/","title":"Creative Commons Zero 1.0 Universal Public Domain Dedication"},{"href":"https://creativecommons.org/publicdomain/mark/1.0/","title":"Creative Commons Public Domain Mark 1.0"},{"href":"https://creativecommons.org/licenses/by/4.0/","title":"Creative Commons Attribution 4.0 International"}]'
const E_TAG = '"a01630a112b0333aa47b390e997534a5"'
export const getLicenses: Operation<GetLicensesParameters> = async ({ accept, "if-none-match": ifNoneMatch }) => {
    checkAccept(accept, DATA_MEDIA_TYPE)
    if (matchesETag(ifNoneMatch, E_TAG)) {
        return create304()
    }
    return {
        body: BODY,
        headers: {
            ...CORS_HEADERS,
            ...DATA_HEADERS,
            ...createETagCacheHeaders(E_TAG),
        },
        statusCode: 200,
    }
}
export default getLicenses
