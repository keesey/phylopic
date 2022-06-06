import { FaultDetector } from "@phylopic/utils"
import fetchData, { SuccessfulFetchDataResponse } from "./fetchData"
export const fetchDataAndCheck = async <T>(
    input: RequestInfo,
    init?: RequestInit,
    detector?: FaultDetector<T>,
): Promise<SuccessfulFetchDataResponse<T>> => {
    const response = await fetchData(input, init, detector)
    if (!response.ok) {
        if (response.code === "DetectionError") {
            throw response.faults
        }
        throw response.error
    }
    return response
}
export default fetchDataAndCheck
