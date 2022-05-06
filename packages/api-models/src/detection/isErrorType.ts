import type { ValidationFaultCollector } from "@phylopic/utils/dist/validation"
import { invalidate } from "@phylopic/utils/dist/validation"
import ERROR_TYPES from "../constants/ERROR_TYPES"
import { ErrorType } from "../types/Error"
const VALIDATION_MESSAGE = `Expected on of these error types: "${[...ERROR_TYPES].sort().join('", "')}".`
export const isErrorType = (x: unknown, faultCollector?: ValidationFaultCollector): x is ErrorType =>
    ERROR_TYPES.has(x as ErrorType) || invalidate(faultCollector, VALIDATION_MESSAGE)
export default isErrorType
