import { stringifyNormalized } from "@phylopic/utils"
import { State } from "../context/State"
import { SerializedState } from "./SerializedState"
const serialize = (state: State): string => {
    return stringifyNormalized({
        ...state,
        collections: Object.fromEntries(
            Object.entries(state.collections).map(([name, set]) => [name, Array.from(set).sort()]),
        ),
    } as SerializedState)
}
export default serialize
