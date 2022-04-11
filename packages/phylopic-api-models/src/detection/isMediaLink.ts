import { ImageMediaType } from "phylopic-utils/src/models"
import { MediaLink } from "~/types/MediaLink"
import isLink from "./isLink"
import isSizes from "./isSizes"
export const isMediaLink = <THRef extends string, TType extends ImageMediaType>(
    x: unknown,
    isHRef: (x: unknown) => x is THRef,
    isType: (x: unknown) => x is TType,
): x is MediaLink<THRef, TType> =>
    isLink(x, isHRef) && isSizes((x as MediaLink<THRef, TType>).sizes) && isType((x as MediaLink<THRef, TType>).type)
export default isMediaLink
