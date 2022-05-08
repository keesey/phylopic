import isFiniteNumber from "./isFiniteNumber.js"
export const isInteger = (x: unknown): x is number => isFiniteNumber(x) && Math.floor(x) === x
export default isInteger
