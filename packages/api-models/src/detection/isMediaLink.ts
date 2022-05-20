import type { ValidationFaultCollector } from "@phylopic/utils"
import { FaultDetector, ImageMediaType } from "@phylopic/utils"
import { MediaLink } from "../types/MediaLink"
import isLink from "./isLink"
import isSizes from "./isSizes"
export const isMediaLink =
    <THRef extends string, TType extends ImageMediaType>(
        isHRef: FaultDetector<THRef>,
        isType: FaultDetector<TType>,
    ): FaultDetector<MediaLink<THRef, TType>> =>
    (x: unknown, faultCollector?: ValidationFaultCollector): x is MediaLink<THRef, TType> =>
        isLink(isHRef)(x, faultCollector) &&
        isSizes((x as MediaLink<THRef, TType>).sizes, faultCollector?.sub("sizes")) &&
        isType((x as MediaLink<THRef, TType>).type, faultCollector?.sub("type"))
export default isMediaLink
