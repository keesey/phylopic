import createQueryString from "./createQueryString"
const createSearch = (query: Readonly<Record<string, string | number | boolean | undefined>>) => {
    const queryString = createQueryString(query)
    return queryString ? `?${queryString}` : ""
}
export default createSearch
