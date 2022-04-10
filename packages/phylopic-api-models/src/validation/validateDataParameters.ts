import { DataParameters } from "../queryParameters/DataParameters"
import { ValidationFault } from "./ValidationFault"
export const validateDataParameters = (parameters: DataParameters) => {
    const faults: ValidationFault[] = []
    if (typeof parameters.build === "string") {
        const n = parseInt(parameters.build, 10)
        if (!isFinite(n) || n <= 0) {
            faults.push({
                field: "build",
                message: "Build number must be a positive integer.",
            })
        }
    }
    return faults as readonly ValidationFault[]
}
export default validateDataParameters
