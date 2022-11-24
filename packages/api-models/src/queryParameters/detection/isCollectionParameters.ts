import { isUUID, ValidationFaultCollector } from "@phylopic/utils"
import { CollectionParameters } from "../types/CollectionParameters"
export const isCollectionParameters = (
    x: unknown,
    faultCollector?: ValidationFaultCollector,
): x is CollectionParameters => isUUID((x as CollectionParameters).uuid, faultCollector?.sub("uuid"))
export default isCollectionParameters
