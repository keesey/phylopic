import type { ValidationFaultCollector } from "@phylopic/utils"
import { isObject, isUUID } from "@phylopic/utils"
import { Entity } from "../types/Entity.js"
export const isEntity = <T>(
    x: unknown,
    isValue: (x: unknown, faultCollector?: ValidationFaultCollector) => x is T,
    faultCollector?: ValidationFaultCollector,
): x is Entity<T> =>
    isObject(x, faultCollector) &&
    isUUID((x as Entity<T>).uuid, faultCollector?.sub("uuid")) &&
    isValue((x as Entity<T>).value, faultCollector?.sub("value"))
export default isEntity
