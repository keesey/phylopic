import { Contribution, NodeIdentifier, Source } from "@phylopic/source-models"
import { ImageMediaType } from "@phylopic/utils"
import { AsyncState } from "../AsyncState"
import { EntityEditorState } from "../EntityEditorState"

export type Entry = Readonly<{
    contribution: Contribution
    lineage: readonly NodeIdentifier[]
}>
export type State = AsyncState &
    EntityEditorState<Entry> &
    Readonly<{
        source: Source
        mediaType: ImageMediaType
    }>
