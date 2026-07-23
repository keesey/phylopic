import { type ValidationFaultCollector } from "@phylopic/utils"
import { invalidate, isString } from "@phylopic/utils"
import { Arc } from "../types/Arc"
export const isArc = (x: unknown, faultCollector?: ValidationFaultCollector): x is Arc =>
    (Array.isArray(x) && x.length === 2 && x.every(isString)) ||
    invalidate(faultCollector, "Expected an array of two strings.")
