import axios, { AxiosError } from "axios"
const isNotFoundError = (error: unknown): error is AxiosError =>
    axios.isAxiosError(error)
        ? error.response?.status === 404 || error.response?.status === 410
        : false
export default isNotFoundError
