import type { ValidationFaultCollector } from "@phylopic/utils"
import { isAuthority, isNamespace, isObjectID } from "@phylopic/utils"
import { NodeEmbedded } from "../../types/NodeWithEmbedded.js"
import { NODE_EMBEDDED_PARAMETERS } from "../constants/NODE_EMBEDDED_PARAMETERS.js"
import { ResolveParameters } from "../types/ResolveParameters.js"
import isEmbeddableParameters from "./isEmbeddableParameters.js"
export const isResolveParameters = (x: unknown, faultCollector?: ValidationFaultCollector): x is ResolveParameters =>
    isEmbeddableParameters<NodeEmbedded>(NODE_EMBEDDED_PARAMETERS)(x, faultCollector) &&
    isAuthority((x as ResolveParameters).authority, faultCollector?.sub("authority")) &&
    isNamespace((x as ResolveParameters).namespace, faultCollector?.sub("namespace")) &&
    isObjectID((x as ResolveParameters).objectID, faultCollector?.sub("objectID"))
export default isResolveParameters
