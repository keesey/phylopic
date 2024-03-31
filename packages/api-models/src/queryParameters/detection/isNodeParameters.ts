import { NodeEmbedded } from "../../types"
import { NODE_EMBEDDED_PARAMETERS } from "../constants/NODE_EMBEDDED_PARAMETERS"
import isEntityParameters from "./isEntityParameters"
export const isNodeParameters = isEntityParameters<NodeEmbedded>(NODE_EMBEDDED_PARAMETERS)
export default isNodeParameters
