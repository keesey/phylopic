import { ISOTimestamp, Nomen, UUID } from "phylopic-utils/src"
export type Node = Readonly<{
    created: ISOTimestamp
    names: readonly Nomen[]
    parent?: UUID
}>
