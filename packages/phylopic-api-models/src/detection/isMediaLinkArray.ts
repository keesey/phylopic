import { ImageMediaType } from "phylopic-utils/src/models"
import { MediaLink } from ".."
import isMediaLink from "./isMediaLink"
export const isMediaLinkArray = <THRef extends string, TType extends ImageMediaType>(
    x: unknown,
    isHRef: (x: unknown) => x is THRef,
    isType: (x: unknown) => x is TType,
): x is ReadonlyArray<MediaLink<THRef, TType>> => Array.isArray(x) && x.every(link => isMediaLink(link, isHRef, isType))
export default isMediaLinkArray
