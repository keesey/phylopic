import isNormalizedText from "../../detection/isNormalizedText.js"
import type ValidationFaultCollector from "../../validation/ValidationFaultCollector.js"
import { ObjectID } from "../types/ObjectID.js"
export const isObjectID: (x: unknown, faultCollector?: ValidationFaultCollector) => x is ObjectID = isNormalizedText
export default isObjectID
