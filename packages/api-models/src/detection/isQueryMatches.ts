import { isArray, isNormalizedText, type ValidationFaultCollector } from "@phylopic/utils"
import { type QueryMatches } from "../types/QueryMatches"
import { isData } from "./isData"
import { isLink } from "./isLink"
import { isLinks } from "./isLinks"
export const isQueryMatches = (x: unknown, faultCollector?: ValidationFaultCollector): x is QueryMatches =>
    isData(x, faultCollector) &&
    isLinks((x as QueryMatches)._links, isLink(isNormalizedText), faultCollector?.sub("_links")) &&
    isArray(isNormalizedText)((x as QueryMatches).matches, faultCollector?.sub("matches"))
