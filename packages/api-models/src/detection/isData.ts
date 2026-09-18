import { isObject, isPositiveInteger, type ValidationFaultCollector } from "@phylopic/utils"
import type { Data } from "../types/Data"

export const isData = (x: unknown, faultCollector?: ValidationFaultCollector): x is Data =>
    isObject(x, faultCollector) && isPositiveInteger((x as Data).build, faultCollector?.sub("build"))
