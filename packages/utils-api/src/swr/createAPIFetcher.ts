import { DATA_MEDIA_TYPE, ErrorResponse } from "@phylopic/api-models"
import { URL } from "@phylopic/utils"
import axios from "axios"
import { Dispatch, SetStateAction } from "react"
import { type Fetcher } from "swr"
import APISWRError from "./APISWRError"
export const createAPIFetcher =
    <T extends Readonly<{ build: number }>>(
        build?: number,
        setBuild?: Dispatch<SetStateAction<number>>,
    ): Fetcher<T, URL> =>
    async key => {
        try {
            const response = await axios.get<T>(key, { responseType: "json" })
            const dataBuild = response.data?.build
            if (typeof dataBuild === "number" && (typeof build !== "number" || isNaN(build) || dataBuild > build)) {
                setBuild?.((build = dataBuild))
            }
            return response.data
        } catch (e) {
            if (axios.isAxiosError(e) && e.response) {
                if (e.response.headers["content-type"] === DATA_MEDIA_TYPE) {
                    const data = e.response.data as ErrorResponse | undefined
                    const dataBuild = data?.build
                    if (typeof dataBuild === "number" && (typeof build !== "number" || dataBuild > build)) {
                        setBuild?.((build = dataBuild))
                    }
                    throw new APISWRError(e.response.status, e.response.statusText, data)
                }
                throw new APISWRError(e.response.status, e.response.statusText)
            }
            throw e
        }
    }
export default createAPIFetcher
