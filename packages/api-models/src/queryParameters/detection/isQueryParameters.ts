import type { ValidationFaultCollector } from "@phylopic/utils"
import { isNormalizedText } from "@phylopic/utils"
import { SearchParameters } from "../types/SearchParameters.js"
import isDataParameters from "./isDataParameters.js"
export const isQueryParameters = (x: unknown, faultCollector?: ValidationFaultCollector) =>
    isDataParameters(x, faultCollector) && isNormalizedText((x as SearchParameters).query, faultCollector?.sub("query"))
export default isQueryParameters