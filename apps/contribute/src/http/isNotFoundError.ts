import { APISWRError } from "@phylopic/utils-api"
import axios, { AxiosError } from "axios"
const isNotFoundError = (error: unknown): error is AxiosError | APISWRError => {
    if (axios.isAxiosError(error)) {
        const status = error.response?.status
        return typeof status === "number" && status >= 400 && status < 500
    }
    if (error instanceof APISWRError) {
        return error.statusCode >= 400 && error.statusCode < 500
    }
    return false
}
export default isNotFoundError
