import { DATA_MEDIA_TYPE, ErrorResponse } from "@phylopic/api-models"
import { URL } from "@phylopic/utils"
import axios from "axios"
import { Dispatch, SetStateAction } from "react"
import { Fetcher } from "swr"
import APISWRError from "./APISWRError"
export const createAPIFetcher =
    <T extends Readonly<{ build: number }>>(setBuild?: Dispatch<SetStateAction<number>>): Fetcher<T, URL> =>
    async key => {
        try {
            const response = await axios.get<T>(key, { responseType: "json" })
            if (setBuild && typeof response.data?.build === "number") {
                setBuild(response.data.build)
            }
            return response.data
        } catch (e) {
            if (axios.isAxiosError(e) && e.response) {
                if (e.response.headers["content-type"] === DATA_MEDIA_TYPE) {
                    const data = e.response.data as ErrorResponse | undefined
                    const build = data?.build
                    if (setBuild && typeof build === "number") {
                        setBuild(build)
                    }
                    throw new APISWRError(e.response.status, e.response.statusText, data)
                }
                throw new APISWRError(e.response.status, e.response.statusText)
            }
            throw e
        }
    }
export default createAPIFetcher
