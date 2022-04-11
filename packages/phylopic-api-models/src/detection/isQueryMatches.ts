import { isString } from "phylopic-utils/src/types"
import { QueryMatches } from ".."
import isLinks from "./isLinks"
export const isQueryMatches = (x: unknown): x is QueryMatches =>
    typeof x === "object" &&
    x !== null &&
    isLinks((x as QueryMatches)._links) &&
    Array.isArray((x as QueryMatches).matches) &&
    (x as QueryMatches).matches.every(isString)
export default isQueryMatches
