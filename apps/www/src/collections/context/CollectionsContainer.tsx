import { FC, ReactNode, useEffect, useReducer, useState } from "react"
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
    const [initialized, setInitialized] = useState(false)
    useEffect(() => {
        const persisted = localStorage.getItem(LOCAL_STORAGE_KEY)
        if (persisted) {
            let payload: State
            try {
                payload = deserialize(persisted)
            } catch {
                // Corrupted.
                localStorage.removeItem(LOCAL_STORAGE_KEY)
                setInitialized(true)
                return
            }
            dispatch({ payload, type: "INITIALIZE" })
            setInitialized(true)
        }
    }, [dispatch])
    useEffect(() => {
        if (initialized) {
            localStorage.setItem(LOCAL_STORAGE_KEY, serialize(state))
        }
    }, [initialized, state])
    return <CollectionsContext.Provider value={value}>{children}</CollectionsContext.Provider>
}
export default CollectionsContainer
