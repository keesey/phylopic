import type { ValidationFaultCollector } from "@phylopic/utils"
import { NodeEmbedded } from "../../types/NodeWithEmbedded.js"
import NODE_EMBEDDED_PARAMETERS from "../constants/NODE_EMBEDDED_PARAMETERS.js"
import { NodeLineageParameters } from "../types/NodeLineageParameters.js"
import isListParameters from "./isListParameters.js"
export const isNodeLineageParameters = (
    x: unknown,
    faultCollector?: ValidationFaultCollector,
): x is NodeLineageParameters => isListParameters<NodeEmbedded>(NODE_EMBEDDED_PARAMETERS)(x, faultCollector)
export default isNodeLineageParameters
