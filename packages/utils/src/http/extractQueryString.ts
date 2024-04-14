import { URL } from "../models/types/URL"
export const extractQueryString = (url: URL) => {
    const [, queryAndFragment] = url.split("?", 2)
    const [queryString] = (queryAndFragment ?? "").split("#", 2)
    return queryString
}
