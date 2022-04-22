import { ValidationFaultCollector } from "phylopic-utils/src/validation"
import { FaultDetector } from "phylopic-utils/src/detection"
import convertValidationFaultsToErrors from "./convertValidationFaultsToErrors"
import APIError from "../errors/APIError"
const validate = <T>(
    x: unknown,
    detector: FaultDetector<T>,
    userMessage = "There was a problem with a request for data.",
    statusCode = 400,
    additionalHeaders: { [name: string]: string | number | boolean } = {},
): x is T => {
    const collector = new ValidationFaultCollector()
    if (!detector(x, collector)) {
        throw new APIError(
            statusCode,
            convertValidationFaultsToErrors(collector.list(), userMessage),
            additionalHeaders,
        )
    }
    return true
}
export default validate
