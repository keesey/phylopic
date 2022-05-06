import { DATA_MEDIA_TYPE, ErrorResponse } from "@phylopic/api-models"
import { URL } from "@phylopic/utils/dist/models/types"
import fetch from "cross-fetch"
import { Dispatch, SetStateAction } from "react"
import { Fetcher } from "swr"
import APISWRError from "./APISWRError"
const createAPIFetcher =
    <T extends Readonly<{ build: number }>>(setBuild?: Dispatch<SetStateAction<number>>): Fetcher<T, URL> =>
    async key => {
        const response = await fetch(key)
        if (response.ok) {
            const data: T = await response.json()
            if (setBuild && typeof data?.build === "number") {
                setBuild(data.build)
            }
            return data as T
        } else if (response.headers.get("content-type") === DATA_MEDIA_TYPE) {
            let data: ErrorResponse | undefined
            try {
                data = await response.json()
                if (setBuild && typeof data?.build === "number") {
                    setBuild(data.build)
                }
            } catch (e) {
                // Corrupted JSON. Ignore.
            }
            throw new APISWRError(response.status, response.statusText, data)
        }
        throw new APISWRError(response.status, response.statusText)
    }
export default createAPIFetcher
