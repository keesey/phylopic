import type { Error, ValidationFault } from "phylopic-api-types"
const convertValidationFaultsToErrors = (faults: readonly ValidationFault[], userMessage: string) =>
    faults.map(
        fault =>
            ({
                developerMessage: fault.message,
                field: fault.field,
                type: "BAD_REQUEST_BODY",
                userMessage,
            } as Error),
    )
export default convertValidationFaultsToErrors
