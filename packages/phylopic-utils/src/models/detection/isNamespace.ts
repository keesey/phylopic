import { ValidationFaultCollector } from "../../validation/ValidationFaultCollector"
import { Namespace } from "../types"
import { isNormalizedText } from "./isNormalizedText"
const isNamespace: (x: unknown, faultCollector?: ValidationFaultCollector) => x is Namespace = isNormalizedText
export default isNamespace
