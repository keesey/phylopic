import isInteger from "./isInteger"
export const isPositiveInteger = (x: unknown): x is number => isInteger(x) && x > 0
export default isPositiveInteger
