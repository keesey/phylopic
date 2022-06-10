import { DATA_MEDIA_TYPE, ErrorResponse } from "@phylopic/api-models"
import { FaultDetector, ValidationFault, ValidationFaultCollector } from "@phylopic/utils"
import fetch from "cross-fetch"
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
export type JSONErrorFetchDataResponse = {
    code: "JSONError"
    error: unknown
    ok: false
}
export type FetchDataResponse<T> =
    | SuccessfulFetchDataResponse<T>
    | DetectionErrorFetchDataResponse
    | HTTPErrorFetchDataResponse
    | JSONErrorFetchDataResponse
export const fetchData = async <T>(
    input: RequestInfo,
    init?: RequestInit,
    detector?: FaultDetector<T>,
): Promise<FetchDataResponse<T>> => {
    const response = await fetch(input, init)
    if (response.ok) {
        try {
            const data = await response.json()
            if (detector) {
                const collector = new ValidationFaultCollector(["body"])
                if (!detector(data, collector)) {
                    return {
                        code: "DetectionError",
                        ok: false,
                        faults: collector.list(),
                    }
                }
            }
            return {
                data,
                headers: response.headers,
                ok: true,
                status: response.status,
                statusText: response.statusText,
            }
        } catch (e) {
            return {
                code: "JSONError",
                ok: false,
                error: e,
            }
        }
    } else if (response.headers.get("content-type") === DATA_MEDIA_TYPE) {
        let data: ErrorResponse
        try {
            data = await response.json()
        } catch (error) {
            return {
                code: "HTTPError",
                headers: response.headers,
                ok: false,
                error,
                status: response.status,
                statusText: response.statusText,
            }
        }
        return {
            build: data.build,
            code: "HTTPError",
            details: data.stack ?? undefined,
            error: data.errors,
            headers: response.headers,
            ok: false,
            status: response.status,
            statusText: response.statusText,
        }
    }
    return {
        code: "HTTPError",
        headers: response.headers,
        ok: false,
        status: response.status,
        statusText: response.statusText,
    }
}
export default fetchData
