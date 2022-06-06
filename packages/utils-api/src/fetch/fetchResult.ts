import { FaultDetector } from "@phylopic/utils"
import fetchData from "./fetchData"
export type SuccessfulFetchResult<T> = {
    data: T
    ok: true
    status: "success"
}
export type NotFoundFetchResult = {
    ok: false
    status: "notFound"
}
export type ErrorFetchResult = {
    error: unknown
    ok: false
    status: "error"
}
export type FetchResult<T> = SuccessfulFetchResult<T> | NotFoundFetchResult | ErrorFetchResult
export const fetchResult = async <T>(
    input: RequestInfo,
    init?: RequestInit,
    detector?: FaultDetector<T>,
): Promise<FetchResult<T>> => {
    const response = await fetchData(input, init, detector)
    if (response.ok) {
        return {
            data: response.data,
            ok: true,
            status: "success",
        }
    }
    switch (response.code) {
        case "DetectionError": {
            return {
                error: response.faults,
                ok: false,
                status: "error",
            }
        }
        case "HTTPError": {
            if (response.status >= 400 && response.status < 500) {
                return {
                    ok: false,
                    status: "notFound",
                }
            }
            return {
                error: new Error(response.statusText),
                ok: false,
                status: "error",
            }
        }
        case "JSONError": {
            return {
                error: response.error,
                ok: false,
                status: "error",
            }
        }
    }
}
export default fetchResult
