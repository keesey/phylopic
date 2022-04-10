import { ResolveParameters } from "../queryParameters/ResolveParameters"
import { ValidationFault } from "./ValidationFault"
export const validateResolveParameters = (parameters: Partial<ResolveParameters>): readonly ValidationFault[] => {
    const faults: ValidationFault[] = []
    if (!parameters.authority) {
        faults.push({
            field: "authority",
            message: 'The "authority" field is missing.',
        })
    }
    if (!parameters.namespace) {
        faults.push({
            field: "namespace",
            message: 'The "namespace" field is missing.',
        })
    }
    if (!parameters.objectID) {
        faults.push({
            field: "objectID",
            message: 'The "objectID" field is missing.',
        })
    }
    return faults
}
