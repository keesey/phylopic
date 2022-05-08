import type { ValidationFaultCollector } from "@phylopic/utils"
import { invalidate } from "@phylopic/utils"
import ERROR_TYPES from "../constants/ERROR_TYPES.js"
import { ErrorType } from "../types/ErrorType.js"
const VALIDATION_MESSAGE = `Expected on of these error types: "${[...ERROR_TYPES].sort().join('", "')}".`
export const isErrorType = (x: unknown, faultCollector?: ValidationFaultCollector): x is ErrorType =>
    ERROR_TYPES.has(x as ErrorType) || invalidate(faultCollector, VALIDATION_MESSAGE)
export default isErrorType
