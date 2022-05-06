import { isAuthority, isNamespace, isObjectID } from "@phylopic/utils/dist/models/detection"
import type { ValidationFaultCollector } from "@phylopic/utils/dist/validation"
import { NodeEmbedded } from "../../types/NodeWithEmbedded"
import { NODE_EMBEDDED_PARAMETERS } from "../constants"
import { ResolveParameters } from "../types"
import isEmbeddableParameters from "./isEmbeddableParameters"
export const isResolveParameters = (x: unknown, faultCollector?: ValidationFaultCollector): x is ResolveParameters =>
    isEmbeddableParameters<NodeEmbedded>(NODE_EMBEDDED_PARAMETERS)(x, faultCollector) &&
    isAuthority((x as ResolveParameters).authority, faultCollector?.sub("authority")) &&
    isNamespace((x as ResolveParameters).namespace, faultCollector?.sub("namespace")) &&
    isObjectID((x as ResolveParameters).objectID, faultCollector?.sub("objectID"))
export default isResolveParameters
