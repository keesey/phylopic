import { isObject } from "phylopic-utils/src/detection"
import { isUUID } from "phylopic-utils/src/models/detection"
import { ValidationFaultCollector } from "phylopic-utils/src/validation"
import { Entity } from "../types"
export const isEntity = <T>(
    x: unknown,
    isValue: (x: unknown, faultCollector?: ValidationFaultCollector) => x is T,
    faultCollector?: ValidationFaultCollector,
): x is Entity<T> =>
    isObject(x, faultCollector) &&
    isUUID((x as Entity<T>).uuid, faultCollector?.sub("uuid")) &&
    isValue((x as Entity<T>).value, faultCollector?.sub("value"))
export default isEntity
