import { APISWRError } from "@phylopic/utils-api"
import axios, { AxiosError } from "axios"
const isServerError = (error: unknown): error is AxiosError | APISWRError => {
    if (axios.isAxiosError(error)) {
        const status = error.response?.status
        return typeof status === "number" && status >= 500
    }
    if (error instanceof APISWRError) {
        return error.statusCode >= 500
    }
    return false
}
export default isServerError
