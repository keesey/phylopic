import ERROR_TYPES from "~/constants/ERROR_TYPES"
import { ErrorType } from "~/types/Error"
export const isErrorType = (x: unknown): x is ErrorType => ERROR_TYPES.has(x as ErrorType)
export default isErrorType
