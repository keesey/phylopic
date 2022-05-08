import { ParsedQuery } from "./Query.js"
export const parseQueryString = <TQuery extends ParsedQuery = ParsedQuery>(query: string) =>
    query
        .split("&")
        .map(part => part.split("=", 2).map(decodeURIComponent) as [string, string])
        .reduce<Partial<TQuery>>(
            (prev, [key, value]) => ({
                ...prev,
                [key]: value,
            }),
            {},
        )
export default parseQueryString
