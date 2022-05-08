import isNumber from "./isNumber.js"
export const isFiniteNumber = (x: unknown): x is number => isNumber(x) && isFinite(x)
export default isFiniteNumber
