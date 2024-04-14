import { isNumber } from "./isNumber"
export const isFiniteNumber = (x: unknown): x is number => isNumber(x) && isFinite(x)
