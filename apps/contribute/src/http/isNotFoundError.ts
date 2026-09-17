import { APISWRError } from "@phylopic/utils-api"
import axios, { AxiosError } from "axios"
const isNotFoundError = (error: unknown): error is AxiosError | APISWRError => {
    if (axios.isAxiosError(error)) {
        return error.response?.status === 404
    }
    if (error instanceof APISWRError) {
        return error.statusCode === 404
    }
    return false
}
export default isNotFoundError
