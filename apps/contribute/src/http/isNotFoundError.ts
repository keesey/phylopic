import { APISWRError } from "@phylopic/utils-api"
import axios, { AxiosError } from "axios"
const isNotFoundError = (error: unknown): error is AxiosError | APISWRError => {
    if (axios.isAxiosError(error)) {
        return error.response?.status === 404 || error.response?.status === 410
    }
    if (error instanceof APISWRError) {
        return error.statusCode === 404 || error.statusCode === 410
    }
    return false
}
export default isNotFoundError
