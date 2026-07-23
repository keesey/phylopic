import { isFiniteNumber } from "./isFiniteNumber"
export const isInteger = (x: unknown): x is number => isFiniteNumber(x) && Math.floor(x) === x
