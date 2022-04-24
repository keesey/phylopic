import {
    isISOTimestamp,
    isNomen,
    isNonemptyArray,
    isNullOr,
    isObject,
    isUUID,
    ValidationFaultCollector,
} from "phylopic-utils/src"
import { Node } from "../types"
export const isNode = (x: unknown, faultCollector?: ValidationFaultCollector): x is Node =>
    isObject(x, faultCollector) &&
    isISOTimestamp((x as Node).created, faultCollector?.sub("created")) &&
    isNonemptyArray(isNomen)((x as Node).names, faultCollector?.sub("names")) &&
    isNullOr(isUUID)((x as Node).parent, faultCollector?.sub("parent"))
export default isNode
