import type { ValidationFaultCollector } from "@phylopic/utils"
import { isArray, isNormalizedText, isObject } from "@phylopic/utils"
import { QueryMatches } from "../types/QueryMatches"
import isLinks from "./isLinks"
export const isQueryMatches = (x: unknown, faultCollector?: ValidationFaultCollector): x is QueryMatches =>
    isObject(x, faultCollector) &&
    isLinks((x as QueryMatches)._links, faultCollector?.sub("_links")) &&
    isArray(isNormalizedText)((x as QueryMatches).matches, faultCollector?.sub("matches"))
export default isQueryMatches
