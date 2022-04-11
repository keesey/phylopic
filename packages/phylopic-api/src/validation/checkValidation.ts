import type { ValidationFault } from "phylopic-api-types"
import APIError from "../errors/APIError"
import convertValidationFaultsToErrors from "./convertValidationFaultsToErrors"
const checkValidation = (faults: readonly ValidationFault[], userMessage: string, statusCode = 400) => {
    if (faults.length) {
        throw new APIError(statusCode, convertValidationFaultsToErrors(faults, userMessage))
    }
}
export default checkValidation
