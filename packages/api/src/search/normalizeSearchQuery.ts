import { normalizeQuery } from "@phylopic/api-models"
import APIError from "../errors/APIError"
import MIN_QUERY_LENGTH from "./MIN_QUERY_LENGTH"
export const normalizeSearchQuery = (query: string) => {
    query = normalizeQuery(query)
    if (query.length < MIN_QUERY_LENGTH) {
        throw new APIError(400, [
            {
                developerMessage: `Search text must be at least two characters, trimmed. Provided value is invalid: ${
                    typeof query === "string" ? `"${query}"` : String(query)
                }.`,
                field: "query",
                type: "BAD_REQUEST_PARAMETERS",
                userMessage: "The search text must be at least two characters in length.",
            },
        ])
    }
    return query
}
export default normalizeSearchQuery
