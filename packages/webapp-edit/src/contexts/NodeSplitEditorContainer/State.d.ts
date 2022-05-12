import { Entity, Node } from "@phylopic/source-models"
import { Nomen } from "@phylopic/utils"
import { AsyncState } from "../AsyncState"

export type Entry = Entity<Node> & {
    parentName?: Nomen
}
export type State = AsyncState &
    Readonly<{
        created: Entry
        original: Entry
    }>
