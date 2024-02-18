import { Node } from "@phylopic/api-models"
import axios from "axios"
import { useMemo } from "react"
import useSWRImmutable from "swr/immutable"
import { PBDBResponse } from "./paleobiodb.org/PBDBResponse"
import getPaleobioDbTxnIds from "./paleobiodb.org/getPaleobioDbTxnIds"
import getStrataUrl from "./paleobiodb.org/getStrataUrl"
import getMrcaUrl from "./timetree.org/getAgeUrl"
import getNcbiTaxIds from "./timetree.org/getNcbiTaxIds"
import { UUID } from "@phylopic/utils"
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
const useNodeAge = (node: Node | null) => {
    const predefined = node ? PREDEFINED[node.uuid] : undefined
    const ncbiTaxIds = useMemo(() => (node ? getNcbiTaxIds(node._links) : null), [node])
    const pbdbTxnIds = useMemo(() => (node ? getPaleobioDbTxnIds(node._links) : []), [node])
    const timeTreeKey = predefined === undefined && ncbiTaxIds?.length ? getMrcaUrl(ncbiTaxIds) : null
    const pbdbKey = predefined === undefined && pbdbTxnIds.length && !timeTreeKey ? getStrataUrl(pbdbTxnIds) : null
    const { data: timeTreeData } = useSWRImmutable<{ value: number }>(timeTreeKey, fetcher)
    const { data: pbdbData } = useSWRImmutable<PBDBResponse>(pbdbKey, fetcher)
    return useMemo<AgeResult | null>(() => {
        if (predefined !== undefined) {
            return predefined
        }
        if (node) {
            if (typeof timeTreeData?.value === "number") {
                return {
                    ages: [timeTreeData.value * MILLION, timeTreeData.value * MILLION],
                    source: "https://timetree.org/",
                    sourceTitle: "Timetree of Life",
                }
            }
            if (pbdbData?.records.length) {
                const eag = Math.max(...pbdbData.records.map(record => record.eag))
                const lag = Math.min(...pbdbData.records.map(record => record.lag))
                return {
                    ages: [eag * MILLION, lag * MILLION],
                    source: "https://paleobiodb.org/",
                    sourceTitle: "Paleobiology Database",
                }
            }
        }
        return null
    }, [pbdbData, predefined, timeTreeData])
}
export default useNodeAge
