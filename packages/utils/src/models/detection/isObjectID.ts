import { isNormalizedText } from "../../detection/isNormalizedText"
import { type ValidationFaultCollector } from "../../validation/ValidationFaultCollector"
import { ObjectID } from "../types/ObjectID"
export const isObjectID: (x: unknown, faultCollector?: ValidationFaultCollector) => x is ObjectID = isNormalizedText
