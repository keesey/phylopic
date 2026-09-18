import { isNormalizedText } from "../../detection/isNormalizedText"
import type { ValidationFaultCollector } from "../../validation/ValidationFaultCollector"
import type { Namespace } from "../types/Namespace"
export const isNamespace: (x: unknown, faultCollector?: ValidationFaultCollector) => x is Namespace = isNormalizedText
