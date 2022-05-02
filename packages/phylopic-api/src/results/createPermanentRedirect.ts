import createSearch from "phylopic-utils/dist/http/createSearch"
import createRedirectHeaders from "../headers/responses/createRedirectHeaders"
const createPermanentRedirect = (
    path: string,
    query: Readonly<Record<string, string | number | boolean | undefined>> = {},
) => {
    return {
        body: "",
        headers: createRedirectHeaders(path + createSearch(query), true),
        statusCode: 308,
    }
}
export default createPermanentRedirect
