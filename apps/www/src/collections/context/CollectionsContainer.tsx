import { FC, ReactNode, useEffect, useReducer } from "react"
import CollectionsContext from "./CollectionsContext"
import INITIAL_STATE from "./INITIAL_STATE"
import reducer from "./reducer"
import deserialize from "../serialization/deserialize"
import serialize from "../serialization/serialize"
import { State } from "./State"
export interface Props {
    children: ReactNode
}
const LOCAL_STORAGE_KEY = "collections"
const CollectionsContainer: FC<Props> = ({ children }) => {
    const value = useReducer(reducer, INITIAL_STATE)
    const [state, dispatch] = value
    useEffect(() => {
        const persisted = localStorage.getItem(LOCAL_STORAGE_KEY)
        if (persisted) {
            let payload: State
            try {
                payload = deserialize(persisted)
            } catch {
                // Corrupted.
                localStorage.removeItem(LOCAL_STORAGE_KEY)
                return
            }
            dispatch({ payload, type: "INITIALIZE" })
        }
    }, [dispatch])
    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, serialize(state))
    }, [state])
    return <CollectionsContext.Provider value={value}>{children}</CollectionsContext.Provider>
}
export default CollectionsContainer
