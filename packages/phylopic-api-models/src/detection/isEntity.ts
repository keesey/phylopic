import { isISOTimestamp, isUUID } from "phylopic-utils/src/models"
import { Entity, Links } from "../types"
import isData from "./isData"
export const isEntity = <TLinks extends Links>(x: unknown, isLinks: (x: unknown) => x is TLinks): x is Entity<TLinks> =>
    isData(x) &&
    isLinks((x as Entity<TLinks>)._links) &&
    isISOTimestamp((x as Entity<TLinks>).created) &&
    isUUID((x as Entity<TLinks>).uuid)
export default isEntity
