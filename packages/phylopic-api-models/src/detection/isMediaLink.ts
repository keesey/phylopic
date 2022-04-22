import { FaultDetector } from "phylopic-utils/src/detection"
import { ImageMediaType } from "phylopic-utils/src/models"
import { ValidationFaultCollector } from "phylopic-utils/src/validation"
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
