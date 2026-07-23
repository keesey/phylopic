export type PBDBTaxonRecord = Readonly<{
    ext: "0" | "1"
    nam: string
    noc: number
    oid: string
    par: string
    rid: string
    rnk: number
    vid: string
}>
export type PBDBTaxonResponse = Readonly<{
    elapsed_time: number
    records: readonly PBDBTaxonRecord[]
}>
