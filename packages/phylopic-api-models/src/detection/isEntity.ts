import { isISOTimestamp, isUUID } from "phylopic-utils/src/models/detection"
import { ValidationFaultCollector } from "phylopic-utils/src/validation"
import { Entity, Links } from "../types"
import isData from "./isData"
export const isEntity = <TLinks extends Links>(
    x: unknown,
    isLinks: (x: unknown, faultCollector?: ValidationFaultCollector) => x is TLinks,
    faultCollector?: ValidationFaultCollector,
): x is Entity<TLinks> =>
    isData(x, faultCollector) &&
    isLinks((x as Entity<TLinks>)._links, faultCollector?.sub("_links")) &&
    isISOTimestamp((x as Entity<TLinks>).created, faultCollector?.sub("created")) &&
    isUUID((x as Entity<TLinks>).uuid, faultCollector?.sub("uuid"))
export default isEntity
