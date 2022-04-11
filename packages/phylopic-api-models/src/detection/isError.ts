import { isString, isTypeOrUndefined } from "phylopic-utils/src/types"
import { Error } from "~/types/Error"
import isErrorType from "./isErrorType"
export const isError = (x: unknown): x is Error =>
    typeof x == "object" &&
    x !== null &&
    isString((x as Error).developerMessage) &&
    isTypeOrUndefined((x as Error).documentation, isString) &&
    isTypeOrUndefined((x as Error).field, isString) &&
    isErrorType((x as Error).type) &&
    isString((x as Error).userMessage)
export default isError
