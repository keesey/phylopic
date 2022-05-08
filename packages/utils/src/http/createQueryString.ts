import { Query } from "./Query.js"
export const createQueryString = (params: Query) => {
    return Object.keys(params)
        .filter(key => params[key] !== undefined)
        .sort()
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(String(params[key]))}`)
        .join("&")
}
export default createQueryString
