import type { UUID } from "@phylopic/utils"
import type { State } from "../context/State"

export type SerializedState = Omit<State, "collections"> &
    Readonly<{
        collections: Readonly<Record<string, readonly UUID[]>>
    }>
