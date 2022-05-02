import { isNormalizedText } from "../../detection"
import type ValidationFaultCollector from "../../validation/ValidationFaultCollector"
import { Namespace } from "../types"
export const isNamespace: (x: unknown, faultCollector?: ValidationFaultCollector) => x is Namespace = isNormalizedText
export default isNamespace
