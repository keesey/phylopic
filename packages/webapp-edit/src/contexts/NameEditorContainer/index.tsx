import { Nomen, normalizeNomen, stringifyNormalized } from "@phylopic/utils"
import React, { FC, ReactNode, Reducer, useEffect, useReducer } from "react"
import { Action } from "./Actions"
import Context from "./Context"
import reducer from "./reducer"
import { State } from "./State"

export type Props = {
    children?: ReactNode
    index: number
    name: Nomen
}
const propsToState = ({ index, name }: Props): State => {
    name = normalizeNomen(name)
    return {
        index,
        modified: name,
        original: name,
    }
}
const NameEditorContainer: FC<Props> = ({ children, ...props }) => {
    const contextValue = useReducer<Reducer<State, Action>, Props>(reducer, props, propsToState)
    const [, dispatch] = contextValue
    useEffect(
        () => dispatch({ type: "INITIALIZE", payload: propsToState(props) }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [dispatch, props.index, stringifyNormalized(props.name)],
    )
    return <Context.Provider value={contextValue}>{children}</Context.Provider>
}
export default NameEditorContainer
