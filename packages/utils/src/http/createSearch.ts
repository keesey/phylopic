import createQueryString from "./createQueryString.js"
import { Query } from "./Query.js"
export const createSearch = (query: Query) => {
    const queryString = createQueryString(query)
    return queryString ? `?${queryString}` : ""
}
export default createSearch
