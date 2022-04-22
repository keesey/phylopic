import { isNormalizedText } from "../../detection"
import { ValidationFaultCollector } from "../../validation"
import { Namespace } from "../types"
export const isNamespace: (x: unknown, faultCollector?: ValidationFaultCollector) => x is Namespace = isNormalizedText
export default isNamespace
