import type { ValidationFaultCollector } from "@phylopic/utils"
import { isAuthority, isNamespace, isObjectID } from "@phylopic/utils"
import type { NodeEmbedded } from "../../types/NodeWithEmbedded"
import { NODE_EMBEDDED_PARAMETERS } from "../constants/NODE_EMBEDDED_PARAMETERS"
import type { ResolveObjectParameters } from "../types/ResolveObjectParameters"
import { isDataParameters } from "./isDataParameters"
import { isEmbeddableParameters } from "./isEmbeddableParameters"
export const isResolveObjectParameters = (
    x: unknown,
    faultCollector?: ValidationFaultCollector,
): x is ResolveObjectParameters =>
    isDataParameters(x, faultCollector) &&
    isEmbeddableParameters<NodeEmbedded>(NODE_EMBEDDED_PARAMETERS)(x, faultCollector) &&
    isAuthority((x as ResolveObjectParameters).authority, faultCollector?.sub("authority")) &&
    isNamespace((x as ResolveObjectParameters).namespace, faultCollector?.sub("namespace")) &&
    isObjectID((x as ResolveObjectParameters).objectID, faultCollector?.sub("objectID"))
