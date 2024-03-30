import { type Node } from "@phylopic/api-models"
import axios from "axios"
import { useMemo } from "react"
import useSWRImmutable from "swr/immutable"
import useSWRInfinite from "swr/infinite"
import { type AgeResult } from "./AgeResult"
import PREDEFINED from "./PREDEFINED"
import RECENT from "./RECENT"
import getObjectIDs from "./getObjectIDs"
import { type PBDBStrataResponse } from "./paleobiodb.org/PBDBStrataResponse"
import { type PBDBTaxonResponse } from "./paleobiodb.org/PBDBTaxonResponse"
import getStrataUrl from "./paleobiodb.org/getStrataUrl"
import getTaxonUrl from "./paleobiodb.org/getTaxonUrl"
import getMrcaUrl from "./timetree.org/getAgeUrl"
import { PALEOBIOLOGY_DATABASE, TIMETREE } from "./SOURCES"
const MILLION = 1000000
const fetcher = <T>(key: string) => axios.get<T>(key).then(({ data }) => data)
const getAgeResult = (
    pbdbStrataData: PBDBStrataResponse | undefined,
    pbdbTaxonData: readonly PBDBTaxonResponse[] | undefined,
    predefined: AgeResult | null | undefined,
    timeTreeData: { value: number } | undefined,
): AgeResult | null => {
    if (predefined !== undefined) {
        return predefined
    }
    const extant = pbdbTaxonData
        ? pbdbTaxonData.some(response => response.records.some(record => record.ext === "1"))
        : false
    if (typeof timeTreeData?.value === "number") {
        return {
            ...TIMETREE,
            ages: [timeTreeData.value * MILLION, extant ? 0 : timeTreeData.value * MILLION],
        }
    }
    if (pbdbStrataData?.records.length) {
        const eag = Math.max(...pbdbStrataData.records.map(record => record.eag))
        const lag = Math.min(...pbdbStrataData.records.map(record => record.lag))
        return {
            ...PALEOBIOLOGY_DATABASE,
            ages: [eag * MILLION, extant ? 0 : lag === 0 ? RECENT : lag * MILLION],
        }
    }
    return extant
        ? {
              ...PALEOBIOLOGY_DATABASE,
              ages: [0, 0],
          }
        : null
}
const useNodeAge = (node: Node | null) => {
    const predefined = node ? PREDEFINED[node.uuid] : undefined
    const ncbiTaxIds = useMemo(() => (node ? getObjectIDs(node._links, "ncbi.nlm.nih.gov", "taxid") : []), [node])
    const pbdbTxnIds = useMemo(() => (node ? getObjectIDs(node._links, "paleobiodb.org", "txn") : []), [node])
    const timeTreeKey = predefined === undefined && ncbiTaxIds.length ? getMrcaUrl(ncbiTaxIds) : null
    const pbdbStrataKey =
        predefined === undefined && !timeTreeKey && pbdbTxnIds.length ? getStrataUrl(pbdbTxnIds) : null
    const { data: timeTreeData } = useSWRImmutable<{ value: number }>(timeTreeKey, fetcher)
    const { data: pbdbStrataData } = useSWRImmutable<PBDBStrataResponse>(pbdbStrataKey, fetcher)
    const { data: pbdbTaxonData } = useSWRInfinite<PBDBTaxonResponse>(
        index => (pbdbTxnIds.length > index ? getTaxonUrl(pbdbTxnIds[index]) : null),
        fetcher,
    )
    return useMemo<AgeResult | null>(
        () => getAgeResult(pbdbStrataData, pbdbTaxonData, predefined, timeTreeData),
        [pbdbStrataData, pbdbTaxonData, predefined, timeTreeData],
    )
}
export default useNodeAge
