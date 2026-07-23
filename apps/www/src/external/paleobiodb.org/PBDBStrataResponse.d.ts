export type PBDBStrataRecord = Readonly<{
    cc2: string
    eag: number
    nco: number
    noc: number
    sfm: string
    lag: number
    lth: string
}>
type PBDBStrataResponse = Readonly<{
    elapsed_time: number
    records: readonly PBDBStrataRecord[]
}>
