import { URL } from "../models"
export const extractQueryString = (url: URL) => {
    const [, queryAndFragment] = url.split("?", 2)
    const [queryString] = (queryAndFragment ?? "").split("#", 2)
    return queryString
}
export default extractQueryString
