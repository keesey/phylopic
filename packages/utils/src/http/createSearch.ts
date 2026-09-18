import { createQueryString } from "./createQueryString"
import type { Query } from "./Query"

export const createSearch = (query: Query) => {
    const queryString = createQueryString(query)
    return queryString ? `?${queryString}` : ""
}
