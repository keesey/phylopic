import { ValidationFaultCollector } from "../../validation/ValidationFaultCollector"
import { ObjectID } from "../types"
import { isNormalizedText } from "./isNormalizedText"
const isObjectID: (x: unknown, faultCollector?: ValidationFaultCollector) => x is ObjectID = isNormalizedText
export default isObjectID
