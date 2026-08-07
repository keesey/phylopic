import { AxiosError } from "axios"
/**
 * Distinguishes a rejected token from a legitimate denial for requests to the public API.
 *
 * The API's own error responses always carry an `errors` envelope. API Gateway rejects
 * requests whose token fails the authorizer before they reach the service, so those
 * responses lack it. Without this check an "already uploaded by another contributor"
 * denial would be indistinguishable from an invalid token.
 */
const isUnauthorizedAPIResponse = (error: AxiosError) => {
    const status = error.response?.status
    if (status !== 401 && status !== 403) {
        return false
    }
    const data = error.response?.data as { errors?: unknown } | undefined
    return !Array.isArray(data?.errors)
}
export default isUnauthorizedAPIResponse
