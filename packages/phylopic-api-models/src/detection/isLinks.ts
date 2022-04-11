import { isString } from "phylopic-utils/src/types"
import { Links } from "../types"
import isLink from "./isLink"
export const isLinks = (x: unknown): x is Links =>
    typeof x === "object" && x !== null && isLink((x as Links).self, isString)
export default isLinks
