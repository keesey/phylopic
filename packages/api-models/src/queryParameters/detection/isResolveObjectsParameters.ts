import type { ValidationFaultCollector } from "@phylopic/utils"
import { isAuthority, isNamespace, isObjectIDs } from "@phylopic/utils"
import { NodeEmbedded } from "../../types/NodeWithEmbedded"
import { NODE_EMBEDDED_PARAMETERS } from "../constants/NODE_EMBEDDED_PARAMETERS"
import { ResolveObjectsParameters } from "../types/ResolveObjectsParameters"
import isEmbeddableParameters from "./isEmbeddableParameters"
import isDataParameters from "./isDataParameters"
export const isResolveObjectsParameters = (
    x: unknown,
    faultCollector?: ValidationFaultCollector,
): x is ResolveObjectsParameters =>
    isDataParameters(x, faultCollector) &&
    isEmbeddableParameters<NodeEmbedded>(NODE_EMBEDDED_PARAMETERS)(x, faultCollector) &&
    isAuthority((x as ResolveObjectsParameters).authority, faultCollector?.sub("authority")) &&
    isNamespace((x as ResolveObjectsParameters).namespace, faultCollector?.sub("namespace")) &&
    isObjectIDs((x as ResolveObjectsParameters).objectIDs, faultCollector?.sub("objectIDs"))
export default isResolveObjectsParameters
