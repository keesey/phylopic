import { NODE_EMBEDDED_PARAMETERS } from "../constants"
import isEntityParameters from "./isEntityParameters"
export const isNodeParameters = isEntityParameters(NODE_EMBEDDED_PARAMETERS)
export default isNodeParameters
