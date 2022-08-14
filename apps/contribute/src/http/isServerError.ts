import axios, { AxiosError } from "axios"
const isServerError = (error: unknown): error is AxiosError =>
    axios.isAxiosError(error) ? typeof error.response?.status === "number" && error.response.status >= 500 : false
export default isServerError
