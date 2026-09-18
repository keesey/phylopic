import { isUUIDish, type ValidationFaultCollector } from "@phylopic/utils"
import type { CollectionParameters } from "../types/CollectionParameters"
export const isCollectionParameters = (
    x: unknown,
    faultCollector?: ValidationFaultCollector,
): x is CollectionParameters => isUUIDish((x as CollectionParameters).uuid, faultCollector?.sub("uuid"))
