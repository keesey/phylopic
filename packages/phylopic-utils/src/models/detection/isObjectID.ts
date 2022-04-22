import { isNormalizedText } from "../../detection"
import { ValidationFaultCollector } from "../../validation"
import { ObjectID } from "../types"
export const isObjectID: (x: unknown, faultCollector?: ValidationFaultCollector) => x is ObjectID = isNormalizedText
export default isObjectID
