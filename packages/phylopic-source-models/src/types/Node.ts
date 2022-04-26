import { ISOTimestamp, Nomen, UUID } from "phylopic-utils"
export type Node = Readonly<{
    created: ISOTimestamp
    names: readonly Nomen[]
    parent: UUID | null
}>
