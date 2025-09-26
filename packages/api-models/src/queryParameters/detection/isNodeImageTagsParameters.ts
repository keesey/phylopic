import { isUUIDv4, type ValidationFaultCollector } from "@phylopic/utils"
import { type NodeImageTagsParameters } from "../types/NodeImageTagsParameters"
import { isDataParameters } from "./isDataParameters"
export const isNodeImageTagsParameters = (
    x: unknown,
    faultCollector?: ValidationFaultCollector,
): x is NodeImageTagsParameters =>
    isDataParameters(x) && isUUIDv4((x as NodeImageTagsParameters).uuid, faultCollector?.sub("uuid"))
