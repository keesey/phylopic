import { Entity, Image, Node, Source } from "@phylopic/source-models"
import { ImageMediaType } from "@phylopic/utils"
import { AsyncState } from "../AsyncState"
import { EntityEditorState } from "../EntityEditorState"

export type Entry = Readonly<{
    image: Image
    lineage: readonly Entity<Node>[]
}>
export type State = AsyncState &
    EntityEditorState<Entry> &
    Readonly<{
        mediaType: ImageMediaType
        source: Source
    }>
