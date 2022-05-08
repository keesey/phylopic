import { isNormalizedText } from "../../detection/isNormalizedText.js"
import type ValidationFaultCollector from "../../validation/ValidationFaultCollector.js"
import { Namespace } from "../types/Namespace.js"
export const isNamespace: (x: unknown, faultCollector?: ValidationFaultCollector) => x is Namespace = isNormalizedText
export default isNamespace
