import type { Error } from "@phylopic/api-models"
import type { ValidationFault } from "@phylopic/utils"
const convertValidationFaultsToErrors = (faults: readonly ValidationFault[], userMessage: string) =>
    faults.map(
        fault =>
            ({
                developerMessage: fault.message,
                field: fault.field || undefined,
                type: fault.field === "body" ? "BAD_REQUEST_BODY" : "BAD_REQUEST_PARAMETERS",
                userMessage,
            }) as Error,
    )
export default convertValidationFaultsToErrors
