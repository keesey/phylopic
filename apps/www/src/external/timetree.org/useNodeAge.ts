import { Node } from "@phylopic/api-models"
import axios from "axios"
import { useMemo } from "react"
import useSWRImmutable from "swr/immutable"
import getMrcaUrl from "./getAgeUrl"
import getNcbiTaxId from "./getNcbiTaxId"
const MILLION = 1000000
const fetcher = (key: string) => axios.get<{ value: number }>(key).then(({ data }) => data)
const useNodeAge = (node: Node | null) => {
    const ncbiTaxId = useMemo(() =>node ?  getNcbiTaxId(node._links) : null, [node])
    const key = ncbiTaxId ? getMrcaUrl(ncbiTaxId) : null
    const { data, isLoading } = useSWRImmutable(key, fetcher)
    if (ncbiTaxId && !isLoading && typeof data?.value !== "number") {
        console.debug("No age for ID: " + ncbiTaxId, data)
    }
    return typeof data?.value === "number" ? data.value * MILLION : null
}
export default useNodeAge
