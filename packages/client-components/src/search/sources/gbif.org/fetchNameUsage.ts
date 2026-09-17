import { URL } from "@phylopic/utils"
import { fetchDataAndCheck, JSON_API_HEADERS } from "@phylopic/utils-api"
import type { Fetcher } from "swr"
import { GBIFNameUsage } from "./GBIFNameUsage"
export const fetchNameUsage: Fetcher<GBIFNameUsage | null, URL> = async url => {
    const response = await fetchDataAndCheck<GBIFNameUsage>(url, { headers: JSON_API_HEADERS })
    return response.data ?? null
}
