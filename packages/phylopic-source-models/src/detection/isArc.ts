import isString from "phylopic-utils/src/types/isString"
import { Arc } from "../types"
export const isArc = (x: unknown): x is Arc => Array.isArray(x) && x.length === 2 && x.every(isString)
export default isArc
