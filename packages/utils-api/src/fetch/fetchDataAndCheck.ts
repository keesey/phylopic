import { type FaultDetector } from "@phylopic/utils"
import { type AxiosRequestConfig } from "axios"
import { fetchData, type SuccessfulFetchDataResponse } from "./fetchData"
export const fetchDataAndCheck = async <T>(
    url: string,
    config?: AxiosRequestConfig,
    detector?: FaultDetector<T>,
): Promise<SuccessfulFetchDataResponse<T>> => {
    const response = await fetchData(url, config, detector)
    if (!response.ok) {
        if (response.code === "DetectionError") {
            throw response.faults
        }
        throw response.error
    }
    return response
}
