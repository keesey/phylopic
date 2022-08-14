import axios, { AxiosError } from "axios"
const is5xxError = (error: unknown): error is AxiosError =>
    axios.isAxiosError(error) ? Boolean(typeof error.status === "number" && error.status >= 500) : false
export default is5xxError
