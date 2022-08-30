import invalidate from "../../validation/invalidate"
import type ValidationFaultCollector from "../../validation/ValidationFaultCollector"
import { Hash } from "../types/Hash"
export const isHash = (value: unknown, faultCollector?: ValidationFaultCollector): value is Hash =>
    (typeof value === "string" && /^[a-f0-9]+$/.test(value)) ||
    invalidate(faultCollector, "Not a valid hexadecimal hash.")
export default isHash
