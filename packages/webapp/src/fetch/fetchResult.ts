import { FaultDetector } from "@phylopic/utils/dist/detection"
import fetchData, { HTTPRelatedDataResponse } from "./fetchData"
export type SuccessfulFetchResult<T> = {
    data: T
    ok: true
    status: "success"
}
export type NotFoundFetchResult = {
    ok: false
    status: "notFound"
}
export type RedirectFetchResult = {
    destination: string
    ok: true
    permanent: boolean
    status: "redirect"
}
export type ErrorFetchResult = {
    error: unknown
    ok: false
    status: "error"
}
export type FetchResult<T> = SuccessfulFetchResult<T> | NotFoundFetchResult | RedirectFetchResult | ErrorFetchResult
const getRedirectResult = (response: HTTPRelatedDataResponse) =>
    ({
        destination: response.headers.get("location") ?? "/",
        ok: true,
        permanent: response.status === 308,
        status: "redirect",
    } as FetchResult<never>)
const fetchResult = async <T>(
    input: RequestInfo,
    init?: RequestInit,
    detector?: FaultDetector<T>,
): Promise<FetchResult<T>> => {
    const response = await fetchData(input, init, detector)
    if (response.ok) {
        if (init?.redirect === "manual" && response.status >= 300 && response.status < 400) {
            return getRedirectResult(response)
        }
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
            if (init?.redirect === "error" && response.status >= 300 && response.status < 400) {
                return getRedirectResult(response)
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
