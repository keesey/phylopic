import type { ValidationFaultCollector } from "@phylopic/utils"
import { FaultDetector } from "@phylopic/utils"
import { ValueLink } from "../types/ValueLink"
import isLink from "./isLink"
export const isValueLink =
    <THRef extends string, TValue>(
        isHRef: (x: unknown, faultCollector?: ValidationFaultCollector) => x is THRef,
        isValue: (x: unknown, faultCollector?: ValidationFaultCollector) => x is TValue,
    ): FaultDetector<ValueLink<THRef, TValue>> =>
    (x: unknown, faultCollector?: ValidationFaultCollector): x is ValueLink<THRef, TValue> =>
        isLink(isHRef)(x, faultCollector) &&
        isValue((x as ValueLink<THRef, TValue>).value, faultCollector?.sub("value"))
export default isValueLink
