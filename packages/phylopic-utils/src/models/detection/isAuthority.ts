import { ValidationFaultCollector } from "../../validation/ValidationFaultCollector"
import { Authority } from "../types"
import { isNormalizedText } from "./isNormalizedText"
const isAuthority: (x: unknown, faultCollector?: ValidationFaultCollector) => x is Authority = isNormalizedText
export default isAuthority
