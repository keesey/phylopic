import { Node } from "../types"
import isNode from "./isNode"
export const isNodeArray = (x: unknown): x is readonly Node[] => Array.isArray(x) && x.every(isNode)
export default isNodeArray
