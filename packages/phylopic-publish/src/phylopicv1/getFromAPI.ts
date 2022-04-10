import { RequestOptions } from "http"
import getJSON from "../transport/getJSON"

interface FailedResponse {
    fault: {
        message: string
    }
    success: false
}
interface SuccessfulResponse<T> {
    result: T
    success: true
}
type Response<T> = SuccessfulResponse<T> | FailedResponse
const getFromAPI = async <T>(path: string, sessionID?: string) => {
    const url = new URL(`http://phylopic.org/api/a${path}`)
    const request: RequestOptions = {
        defaultPort: 80,
        host: url.host,
        hostname: url.hostname,
        method: "GET",
        path: url.pathname + url.search,
        port: 80,
        protocol: "http:",
    }
    if (sessionID) {
        request.headers = {
            cookie: `sessionid=${sessionID}`,
        }
    }
    const response: Response<T> = await getJSON(request)
    if (response.success === true) {
        return response.result
    }
    throw new Error(response.fault.message)
}
export default getFromAPI
