import { NODE_EMBEDDED_PARAMETERS } from "../constants/NODE_EMBEDDED_PARAMETERS.js"
import isEntityParameters from "./isEntityParameters.js"
export const isNodeParameters = isEntityParameters(NODE_EMBEDDED_PARAMETERS)
export default isNodeParameters
