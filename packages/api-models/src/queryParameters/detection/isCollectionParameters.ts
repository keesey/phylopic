import { isUUIDish, ValidationFaultCollector } from "@phylopic/utils"
import { CollectionParameters } from "../types/CollectionParameters"
export const isCollectionParameters = (
    x: unknown,
    faultCollector?: ValidationFaultCollector,
): x is CollectionParameters => isUUIDish((x as CollectionParameters).uuid, faultCollector?.sub("uuid"))
