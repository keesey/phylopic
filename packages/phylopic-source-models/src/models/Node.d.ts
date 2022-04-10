import { ISODateTime } from "./ISODateTime"
import { Name } from "./Name"
import { UUID } from "./UUID"

export type Node = Readonly<{
    created: ISODateTime
    names: readonly Name[]
    parent?: UUID
}>
