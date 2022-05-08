import { isISOTimestamp, isUUID, ValidationFaultCollector } from "@phylopic/utils"
import { Entity } from "../types/Entity.js"
import { Links } from "../types/Links.js"
import isData from "./isData.js"
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
