import type { UUID } from "@phylopic/utils"
import type { State } from "../context/State"
import type { SerializedState } from "./SerializedState"

const deserialize = (serialized: string): State => {
    const state: SerializedState = JSON.parse(serialized)
    return {
        ...state,
        collections: Object.fromEntries(
            Object.entries(state.collections).map(([name, list]) => [name, new Set<UUID>(list)]),
        ),
    }
}

export default deserialize
