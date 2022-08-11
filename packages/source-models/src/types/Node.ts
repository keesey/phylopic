import type { ISOTimestamp, Nomen, UUID } from "@phylopic/utils"
export type Node = Readonly<{
    created: ISOTimestamp
    modified: ISOTimestamp
    names: readonly Nomen[]
    parent: UUID | null
}>
