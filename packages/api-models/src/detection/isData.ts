import { isObject, isPositiveInteger } from "@phylopic/utils/dist/detection"
import type { ValidationFaultCollector } from "@phylopic/utils/dist/validation"
import { Data } from "../types"
export const isData = (x: unknown, faultCollector?: ValidationFaultCollector): x is Data =>
    isObject(x, faultCollector) && isPositiveInteger((x as Data).build, faultCollector?.sub("build"))
export default isData
