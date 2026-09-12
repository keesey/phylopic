import { createSearch } from "@phylopic/utils"
import { fetchDataAndCheck, JSON_API_HEADERS } from "@phylopic/utils-api"
import type { Fetcher } from "swr"
import { GBIFNameUsage } from "./GBIFNameUsage"
export const fetchNameUsagePage: Fetcher<Readonly<[readonly GBIFNameUsage[], string]>, [string, string]> = async ([
    url,
    name,
]) => {
    if (name.length < 2) {
        return [[], name]
    }
    const response = await fetchDataAndCheck<readonly GBIFNameUsage[]>(url + createSearch({ q: name }), {
        headers: JSON_API_HEADERS,
    })
    return [response.data, name]
}
