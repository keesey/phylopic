import { NODE_EMBEDDED_PARAMETERS } from "../constants/NODE_EMBEDDED_PARAMETERS"
import isEntityParameters from "./isEntityParameters"
export const isNodeParameters = isEntityParameters(NODE_EMBEDDED_PARAMETERS)
export default isNodeParameters
