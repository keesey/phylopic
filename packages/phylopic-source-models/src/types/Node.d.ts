import { ISOTimestamp, Nomen, UUID } from "phylopic-utils/src/models/types"
export type Node = Readonly<{
    created: ISOTimestamp
    names: readonly Nomen[]
    parent?: UUID
}>
