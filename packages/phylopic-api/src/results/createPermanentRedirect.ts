import { createSearch } from "phylopic-utils"
import createRedirectHeaders from "../headers/responses/createRedirectHeaders"
import PERMANENT_HEADERS from "../headers/responses/PERMANENT_HEADERS"
const createPermanentRedirect = (
    path: string,
    query: Readonly<Record<string, string | number | boolean | undefined>> = {},
) => {
    return {
        body: "",
        headers: {
            ...createRedirectHeaders(path + createSearch(query)),
            ...PERMANENT_HEADERS,
        },
        statusCode: 308,
    }
}
export default createPermanentRedirect
