import { FaultDetector } from "@phylopic/utils"
import APIError from "../errors/APIError"
import validate from "../validation/validate"
const parseEntityJSON = <T>(json: string, detector: FaultDetector<T>): T => {
    let result: T
    try {
        result = JSON.parse(json)
    } catch (e) {
        throw new APIError(500, [
            {
                developerMessage: `Invalid JSON in database: ${json}`,
                type: "DEFAULT_5XX",
                userMessage: "There is a problem with the website (improperly formatted data).",
            },
        ])
    }
    validate(result, detector, "There is a problem with the website (unexpected data structure).", 500)
    return result
}
export default parseEntityJSON
