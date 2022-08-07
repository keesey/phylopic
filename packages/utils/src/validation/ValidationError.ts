import { ValidationFault } from "./ValidationFault"
export class ValidationError extends Error {
    constructor(public readonly faults: readonly ValidationFault[], message: string) {
        super(message)
    }
}
