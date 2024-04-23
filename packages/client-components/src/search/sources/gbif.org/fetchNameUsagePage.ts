import { createSearch } from "@phylopic/utils"
import { fetchDataAndCheck } from "@phylopic/utils-api"
import type { Fetcher } from "swr"
import { GBIFNameUsage } from "./GBIFNameUsage"
export const fetchNameUsagePage: Fetcher<Readonly<[readonly GBIFNameUsage[], string]>, [string, string]> = async ([
    url,
    name,
]) => {
    if (name.length < 2) {
        return [[], name]
    }
    const response = await fetchDataAndCheck<readonly GBIFNameUsage[]>(url + createSearch({ q: name }))
    return [response.data, name]
}
