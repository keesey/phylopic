import axios, { AxiosError } from "axios"
const is4xxError = (error: unknown): error is AxiosError =>
    axios.isAxiosError(error)
        ? Boolean(typeof error.status === "number" && error.status >= 400 && error.status < 500)
        : false
export default is4xxError
