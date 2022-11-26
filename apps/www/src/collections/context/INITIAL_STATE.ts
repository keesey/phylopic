import { UUID } from "@phylopic/utils"
import DEFAULT_COLLECTION_NAME from "./DEFAULT_COLLECTION_NAME"
import { State } from "./State"
const INITIAL_STATE: State = {
    collections: { [DEFAULT_COLLECTION_NAME]: new Set<UUID>() },
    currentCollection: DEFAULT_COLLECTION_NAME,
    entities: {},
    open: false,
}
export default INITIAL_STATE
