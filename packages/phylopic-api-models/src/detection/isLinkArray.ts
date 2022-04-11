import { Link } from "~/types/Link"
import isLink from "./isLink"
export const isLinkArray = <THRef extends string>(
    x: unknown,
    isHRef: (x: unknown) => x is THRef,
): x is ReadonlyArray<Link<THRef>> => Array.isArray(x) && x.every(link => isLink(link, isHRef))
export default isLinkArray
