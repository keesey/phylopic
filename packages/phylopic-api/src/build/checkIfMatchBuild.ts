import BUILD from "./BUILD"
import APIError from "../errors/APIError"
const checkIfMatchBuild = (ifMatch = "*") => {
    if (ifMatch === "*" || ifMatch === BUILD.toString(36)) {
        return
    }
    throw new APIError(412, [
        {
            developerMessage: "Request made to earlier build.",
            type: "DEFAULT_4XX",
            userMessage: "This request was made to a stale list. Please refresh.",
            field: "if-match",
        },
    ])
}
export default checkIfMatchBuild
