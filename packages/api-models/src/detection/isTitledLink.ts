import { FaultDetector, isNormalizedText, type ValidationFaultCollector } from "@phylopic/utils"
import { TitledLink } from "../types/TitledLink"
import { isLink } from "./isLink"
export const isTitledLink =
    <THRef extends string>(
        isHRef: (x: unknown, faultCollector?: ValidationFaultCollector) => x is THRef,
    ): FaultDetector<TitledLink<THRef>> =>
    (x: unknown, faultCollector?: ValidationFaultCollector): x is TitledLink<THRef> =>
        isLink(isHRef)(x, faultCollector) &&
        isNormalizedText((x as TitledLink<THRef>).title, faultCollector?.sub("title"))
