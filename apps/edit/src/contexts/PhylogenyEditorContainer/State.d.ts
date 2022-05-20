import { Node } from "@phylopic/source-models"
import { UUID } from "@phylopic/utils"
import { AsyncState } from "../AsyncState"

export type Arc = Readonly<[UUID, UUID]>
export type NodesMap = Readonly<Record<UUID, Node | undefined>>
export type Entry = Readonly<{
    arcs: readonly Arc[]
    nodesMap: NodesMap
}>
export type State = AsyncState &
    Readonly<{
        modified: Entry
        original: Entry
        root?: UUID
    }>
