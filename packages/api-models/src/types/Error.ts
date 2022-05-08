import { ErrorType } from "./ErrorType.js"
export interface Error {
    readonly developerMessage: string
    readonly documentation?: URL
    readonly field?: string
    readonly type: ErrorType
    readonly userMessage: string
}
