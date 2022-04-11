import type { Error as ErrorData } from "phylopic-api-types"
import APIError from "../errors/APIError"
const DEFAULT_START = 0
const DEFAULT_LENGTH = 16
const MAXIMUM_LENGTH = 64
const normalizeRange = (params: { start?: string; length?: string }, entityLabel = "item") => {
    const start = typeof params.start === "string" ? parseInt(params.start, 10) : null
    const length = typeof params.length === "string" ? parseInt(params.length, 10) : null
    const errors: ErrorData[] = []
    if (typeof length === "number" && (isNaN(length) || length > MAXIMUM_LENGTH || length <= 0)) {
        errors.push({
            developerMessage: `Invalid \`length\` property. Must be an integer from 1 to ${MAXIMUM_LENGTH}.`,
            field: "length",
            type: "BAD_REQUEST_PARAMETERS",
            userMessage: `The request for data has an invalid number of ${entityLabel}s.`,
        })
    }
    if (typeof start === "number" && (isNaN(start) || start < 0)) {
        errors.push({
            developerMessage: "Invalid `start` property. Must be a nonnegative integer.",
            field: "start",
            type: "BAD_REQUEST_PARAMETERS",
            userMessage: `The request for ${entityLabel}s has an invalid starting point.`,
        })
    }
    if (errors.length > 0) {
        throw new APIError(400, errors)
    }
    return {
        length: typeof length === "number" ? length : DEFAULT_LENGTH,
        start: typeof start === "number" ? start : DEFAULT_START,
    }
}
export default normalizeRange
