import { Link } from "~/types/Link"
export const isLink = <THRef extends string>(x: unknown, isHRef: (x: unknown) => x is THRef): x is Link<THRef> =>
    typeof x === "object" && x !== null && isHRef(x as Link<THRef>)
export default isLink
