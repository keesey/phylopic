import { isObject, isPositiveInteger } from "phylopic-utils/src/detection"
import { ValidationFaultCollector } from "phylopic-utils/src/validation"
import { Data } from "../types"
export const isData = (x: unknown, faultCollector?: ValidationFaultCollector): x is Data =>
    isObject(x, faultCollector) && isPositiveInteger((x as Data).build, faultCollector?.sub("build"))
export default isData
