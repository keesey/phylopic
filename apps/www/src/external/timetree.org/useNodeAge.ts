import { Node } from "@phylopic/api-models"
import { useMemo } from "react"
import useSWRImmutable from "swr/immutable"
import fetchField from "./fetchField"
import getMrcaUrl from "./getMrcaAgeUrl"
import getNcbiTaxId from "./getNcbiTaxId"
const MILLION = 1000000
const useNodeAge = (node: Node | null) => {
    const ncbiTaxId = useMemo(() => (node ? getNcbiTaxId(node._links) : null), [node])
    const key = ncbiTaxId ? getMrcaUrl([ncbiTaxId]) : null
    const { data } = useSWRImmutable(key, fetchField)
    return useMemo(() => (data ? parseInt(data, 10) * MILLION || null : null), [data])
}
export default useNodeAge
