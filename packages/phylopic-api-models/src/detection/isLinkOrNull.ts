import { Link } from "~/types/Link"
import isLink from "./isLink"
export const isLinkOrNull = <THRef extends string>(
    x: unknown,
    isHRef: (x: unknown) => x is THRef,
): x is Link<THRef> | null => x === null || isLink(x, isHRef)
export default isLinkOrNull
