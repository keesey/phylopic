import { type ValidationFaultCollector } from "@phylopic/utils"
import { isNormalizedText } from "@phylopic/utils"
import { SearchParameters } from "../types/SearchParameters"
import { isDataParameters } from "./isDataParameters"
export const isQueryParameters = (x: unknown, faultCollector?: ValidationFaultCollector) =>
    isDataParameters(x, faultCollector) && isNormalizedText((x as SearchParameters).query, faultCollector?.sub("query"))
