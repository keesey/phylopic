import normalizeQuery from "../normalization/normalizeQuery"
import MIN_QUERY_LENGTH from "../queryParameters/MIN_QUERY_LENGTH"
import { ValidationFault } from "./ValidationFault"
export const validateQueryText = (value: unknown, field: string): readonly ValidationFault[] => {
    if (typeof value !== "string") {
        return [
            {
                field,
                message: `Expected a query string: ${value}.`,
            },
        ]
    }
    const normalized = normalizeQuery(value)
    if (normalized.length < MIN_QUERY_LENGTH) {
        return [
            {
                field,
                message: `Query string must have at least ${MIN_QUERY_LENGTH} characters after normalization: "${normalized}".`,
            },
        ]
    }
    return []
}
export default validateQueryText
