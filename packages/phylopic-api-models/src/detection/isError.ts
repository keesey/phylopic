import { isNormalizedText, isObject, isUndefinedOr } from "phylopic-utils/src/detection"
import { isURL } from "phylopic-utils/src/models/detection"
import { isString } from "phylopic-utils/src/types"
import { invalidate, ValidationFaultCollector } from "phylopic-utils/src/validation"
import { Error } from "../types/Error"
import isErrorType from "./isErrorType"
export const isError = (x: unknown, faultCollector?: ValidationFaultCollector): x is Error =>
    isObject(x, faultCollector) &&
    (isString((x as Error).developerMessage) ||
        invalidate(faultCollector?.sub("developerMessage"), "Expected text.")) &&
    isUndefinedOr(isURL)((x as Error).documentation, faultCollector?.sub("documentation")) &&
    isUndefinedOr(isNormalizedText)((x as Error).field, faultCollector?.sub("field")) &&
    isErrorType((x as Error).type, faultCollector?.sub("type")) &&
    (isString((x as Error).userMessage) || invalidate(faultCollector?.sub("userMessage"), "Expected text."))
export default isError
