"use client"
import { FC, ReactNode, useCallback, useEffect, useReducer, useState } from "react"
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
    const reload = useCallback(() => {
        const persisted = localStorage.getItem(LOCAL_STORAGE_KEY)
        if (persisted) {
            let payload: State
            try {
                payload = deserialize(persisted)
                dispatch({ payload, type: "INITIALIZE" })
            } catch {
                // Corrupted.
                localStorage.removeItem(LOCAL_STORAGE_KEY)
            }
        }
        setInitialized(true)
    }, [dispatch])
    useEffect(() => {
        const handler = () => setInitialized(false)
        window.addEventListener("blur", handler)
        return () => window.removeEventListener("blur", handler)
    }, [])
    useEffect(() => {
        window.addEventListener("focus", reload)
        return () => window.removeEventListener("focus", reload)
    }, [reload])
    useEffect(() => reload(), [reload])
    useEffect(() => {
        if (initialized) {
            localStorage.setItem(LOCAL_STORAGE_KEY, serialize(state))
        }
    }, [initialized, state])
    return <CollectionsContext.Provider value={value}>{children}</CollectionsContext.Provider>
}
export default CollectionsContainer
