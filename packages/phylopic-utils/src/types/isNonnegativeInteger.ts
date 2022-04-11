import isInteger from "./isInteger"

export const isNonnegativeInteger = (x: unknown): x is number => isInteger(x) && x >= 0
export default isNonnegativeInteger
