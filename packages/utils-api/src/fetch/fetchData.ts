import { ErrorResponse } from "@phylopic/api-models"
import { FaultDetector, ValidationFault, ValidationFaultCollector } from "@phylopic/utils"
import axios, { AxiosRequestConfig } from "axios"
export type HTTPRelatedDataResponse = {
    headers: Headers
    ok: boolean
    status: number
    statusText: string
}
export type SuccessfulFetchDataResponse<T> = HTTPRelatedDataResponse & {
    data: T
    ok: true
}
export type DetectionErrorFetchDataResponse = {
    code: "DetectionError"
    faults: readonly ValidationFault[]
    ok: false
}
export type HTTPErrorFetchDataResponse = HTTPRelatedDataResponse & {
    build?: number
    code: "HTTPError"
    details?: string
    error?: unknown
    ok: false
}
export type FetchDataResponse<T> =
    | SuccessfulFetchDataResponse<T>
    | DetectionErrorFetchDataResponse
    | HTTPErrorFetchDataResponse
export const fetchData = async <T>(
    url: string,
    config?: AxiosRequestConfig<T>,
    detector?: FaultDetector<T>,
): Promise<FetchDataResponse<T>> => {
    try {
        const response = await axios(url, {
            method: "GET",
            responseType: "json",
            ...config,
        })
        if (detector) {
            const collector = new ValidationFaultCollector(["body"])
            if (!detector(response.data, collector)) {
                return {
                    code: "DetectionError",
                    ok: false,
                    faults: collector.list(),
                }
            }
        }
        return {
            data: response.data as T,
            headers: new Headers(response.headers),
            ok: true,
            status: response.status,
            statusText: response.statusText,
        }
    } catch (e) {
        if (axios.isAxiosError(e) && e.response) {
            const data = e.response.data as unknown as ErrorResponse | undefined
            return {
                build: data?.build,
                code: "HTTPError",
                details: data?.stack ?? undefined,
                error: data?.errors,
                headers: new Headers(e.response.headers),
                ok: false,
                status: e.response.status,
                statusText: e.response.statusText,
            }
        }
        throw e
    }
}
export default fetchData
