import { createQueryString } from "./createQueryString"
import { Query } from "./Query"
export const createSearch = (query: Query) => {
    const queryString = createQueryString(query)
    return queryString ? `?${queryString}` : ""
}
