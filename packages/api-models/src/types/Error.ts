import { URL } from "@phylopic/utils"
import { ErrorType } from "./ErrorType"
export interface Error {
    readonly developerMessage: string
    readonly documentation?: URL
    readonly field?: string
    readonly type: ErrorType
    readonly userMessage: string
}
