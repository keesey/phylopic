import { TitledLink } from ".."
import isTitledLink from "./isTitledLink"
export const isTitledLinkArray = <THRef extends string>(
    x: unknown,
    isHRef: (x: unknown) => x is THRef,
): x is ReadonlyArray<TitledLink<THRef>> => Array.isArray(x) && x.every(link => isTitledLink(link, isHRef))
export default isTitledLinkArray
