import { createContext } from "react"
import type { Action } from "./Action"
import INITIAL_STATE from "./INITIAL_STATE"
import type { State } from "./State"
const CollectionsContext = createContext<Readonly<[State, (action: Action) => void]>>([
    INITIAL_STATE,
    () => {
        /**/
    },
])
export default CollectionsContext
