import { Node, Source } from "@phylopic/source-models"
import { Nomen, UUID } from "@phylopic/utils"
import { AsyncState } from "../AsyncState"
import { EntityEditorState } from "../EntityEditorState"

export type NodeMap = Readonly<Record<UUID, Node>>
export type Entry = {
    node: Node
    parentName?: Nomen
}
export type State = AsyncState &
    EntityEditorState<Entry> &
    Readonly<{
        source: Source
    }>
