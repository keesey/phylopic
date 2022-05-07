import { isObject, isPositiveInteger, ValidationFaultCollector } from "@phylopic/utils"
import { Data } from "../types/Data"
export const isData = (x: unknown, faultCollector?: ValidationFaultCollector): x is Data =>
    isObject(x, faultCollector) && isPositiveInteger((x as Data).build, faultCollector?.sub("build"))
export default isData
