import { isNormalizedText } from "phylopic-utils/src/models"
import { TitledLink } from "~/types/TitledLink"
import isLink from "./isLink"
export const isTitledLink = <THRef extends string>(
    x: unknown,
    isHRef: (x: unknown) => x is THRef,
): x is TitledLink<THRef> => isLink(x, isHRef) && isNormalizedText((x as TitledLink<THRef>).title)
export default isTitledLink
