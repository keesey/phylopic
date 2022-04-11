import isString from "../../types/isString"
import { URL } from "../types/URL"
// :TODO: validate URL
export const isURL = (x: unknown): x is URL => isString(x) && x.length > 0
export default isURL
