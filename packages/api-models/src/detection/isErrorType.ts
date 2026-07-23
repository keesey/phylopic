import { invalidate, type ValidationFaultCollector } from "@phylopic/utils"
import { ERROR_TYPES } from "../constants/ERROR_TYPES"
import { type ErrorType } from "../types/ErrorType"
const VALIDATION_MESSAGE = `Expected on of these error types: "${Array.from(ERROR_TYPES).sort().join('", "')}".`
export const isErrorType = (x: unknown, faultCollector?: ValidationFaultCollector): x is ErrorType =>
    ERROR_TYPES.has(x as ErrorType) || invalidate(faultCollector, VALIDATION_MESSAGE)
