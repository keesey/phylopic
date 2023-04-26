import { isArray, isObject, ValidationFaultCollector } from "@phylopic/utils"
import { Errors } from "../types/Errors"
import isError from "./isError"
export const isErrors = (x: unknown, faultCollector?: ValidationFaultCollector): x is Errors =>
    isObject(x, faultCollector) && isArray(isError)((x as Errors).errors, faultCollector?.sub("errors"))
export default isError
