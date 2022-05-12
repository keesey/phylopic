import { UUID } from "@phylopic/utils"

export type EntityEditorState<T> = Readonly<{
    modified: Readonly<T>
    original: Readonly<T>
    uuid: UUID
}>
