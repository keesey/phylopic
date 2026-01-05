import { invalidate, isPositiveInteger, isUndefinedOr, type ValidationFaultCollector } from "@phylopic/utils"
import { type DataParameters } from "../types/DataParameters"
const isPositiveIntegerString = (x: unknown, faultCollector?: ValidationFaultCollector): x is string =>
    (typeof x === "string" && isPositiveInteger(parseFloat(x))) ||
    invalidate(faultCollector, "Expected a positive integer.")
export const isDataParameters = (x: unknown, faultCollector?: ValidationFaultCollector): x is DataParameters =>
    typeof x == "object" &&
    x !== null &&
    isUndefinedOr(isPositiveIntegerString)((x as DataParameters).build, faultCollector?.sub("build"))
