import type { ValidationFaultCollector } from "@phylopic/utils"
import { isISOTimestamp, isNomen, isNonemptyArray, isNullOr, isObject, isUUIDv4 } from "@phylopic/utils"
import { Node } from "../types/Node"
export const isNode = (x: unknown, faultCollector?: ValidationFaultCollector): x is Node =>
    isObject(x, faultCollector) &&
    isISOTimestamp((x as Node).created, faultCollector?.sub("created")) &&
    isISOTimestamp((x as Node).modified, faultCollector?.sub("modified")) &&
    isNonemptyArray(isNomen)((x as Node).names, faultCollector?.sub("names")) &&
    isNullOr(isUUIDv4)((x as Node).parent, faultCollector?.sub("parent"))
export default isNode
