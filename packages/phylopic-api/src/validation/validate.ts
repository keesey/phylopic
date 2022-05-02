import { FaultDetector } from "phylopic-utils/dist/detection/FaultDetector"
import ValidationFaultCollector from "phylopic-utils/dist/validation/ValidationFaultCollector"
import APIError from "../errors/APIError"
import convertValidationFaultsToErrors from "./convertValidationFaultsToErrors"
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
