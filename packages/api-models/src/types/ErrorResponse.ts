import { Error } from "./Error"
export interface ErrorResponse {
    readonly build: number
    readonly errors: readonly Error[]
    readonly stack: string | null
}
