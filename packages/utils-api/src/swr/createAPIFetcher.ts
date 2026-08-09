import { DATA_MEDIA_TYPE, ErrorResponse } from "@phylopic/api-models"
import { URL } from "@phylopic/utils"
import axios from "axios"
import { Dispatch, SetStateAction, startTransition } from "react"
import { type Fetcher } from "swr"
import { DEFAULT_API_HEADERS } from "../fetch/DEFAULT_API_HEADERS"
import { APISWRError } from "./APISWRError"
export const createAPIFetcher =
    <T extends Readonly<{ build: number }>>(
        build?: number,
        setBuild?: Dispatch<SetStateAction<number>>,
    ): Fetcher<T, URL> =>
    async key => {
        try {
            const response = await axios.get<T>(key, {
                headers: DEFAULT_API_HEADERS,
                responseType: "json",
            })
            const dataBuild = response.data?.build
            if (typeof dataBuild === "number" && (typeof build !== "number" || isNaN(build) || dataBuild > build)) {
                build = dataBuild
                if (setBuild) {
                    startTransition(() => setBuild(dataBuild))
                }
            }
            return response.data
        } catch (e) {
            if (axios.isAxiosError(e) && e.response) {
                if (String(e.response.headers["content-type"] ?? "").split(";", 1)[0] === DATA_MEDIA_TYPE) {
                    const data = e.response.data as ErrorResponse | undefined
                    const dataBuild = data?.build
                    if (typeof dataBuild === "number" && (typeof build !== "number" || dataBuild > build)) {
                        build = dataBuild
                        if (setBuild) {
                            startTransition(() => setBuild(dataBuild))
                        }
                    }
                    throw new APISWRError(e.response.status, e.response.statusText, data)
                }
                throw new APISWRError(e.response.status, e.response.statusText)
            }
            throw e
        }
    }
