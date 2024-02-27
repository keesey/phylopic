import { type Node } from "@phylopic/api-models"
import { type UUID } from "@phylopic/utils"
import axios from "axios"
import { useMemo } from "react"
import useSWRImmutable from "swr/immutable"
import useSWRInfinite from "swr/infinite"
import getObjectIDs from "./getObjectIDs"
import { type PBDBStrataResponse } from "./paleobiodb.org/PBDBStrataResponse"
import getStrataUrl from "./paleobiodb.org/getStrataUrl"
import getMrcaUrl from "./timetree.org/getAgeUrl"
import getTaxonUrl from "./paleobiodb.org/getTaxonUrl"
import { PBDBTaxonResponse } from "./paleobiodb.org/PBDBTaxonResponse"
const MILLION = 1000000
const fetcher = <T>(key: string) => axios.get<T>(key).then(({ data }) => data)
export type AgeResult = Readonly<{
    ages: Readonly<[number, number]>
    source: string
    sourceTitle: string
}>
// :KLUDGE: Some rootward nodes are tough to look up via APIs and their estimates are stable.
const PREDEFINED: Record<UUID, AgeResult | null | undefined> = {
    // Biota
    "d2a5e07b-bf10-4733-96f2-cae5a807fc83": {
        ages: [4250000000, 4250000000],
        source: "https://timetree.org/",
        sourceTitle: "Timetree of Life",
    },
    // Pan-Biota
    "8f901db5-84c1-4dc0-93ba-2300eeddf4ab": null,
}
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
            ages: [timeTreeData.value * MILLION, extant ? 0 : timeTreeData.value * MILLION],
            source: "https://timetree.org/",
            sourceTitle: "Timetree of Life",
        }
    }
    if (pbdbStrataData?.records.length) {
        const eag = Math.max(...pbdbStrataData.records.map(record => record.eag))
        const lag = Math.min(...pbdbStrataData.records.map(record => record.lag))
        return {
            ages: [eag * MILLION, extant ? 0 : lag * MILLION],
            source: "https://paleobiodb.org/",
            sourceTitle: "Paleobiology Database",
        }
    }
    return extant
        ? {
              ages: [0, 0],
              source: "https://paleobiodb.org/",
              sourceTitle: "Paleobiology Database",
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
        [pbdbStrataData, predefined, timeTreeData],
    )
}
export default useNodeAge
