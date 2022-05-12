import { Node, Source } from "@phylopic/source-models"
import { UUID } from "@phylopic/utils"
import React, { FC, ReactNode, Reducer, useEffect, useReducer } from "react"
import { Action } from "./Actions"
import Context from "./Context"
import reducer from "./reducer"
import { Entry, State } from "./State"

export type Props = {
    children?: ReactNode
    parent?: Node
    source: Source
    uuid: UUID
    value: Node
}
const propsToState = ({ parent, source, uuid, value: node }: Props): State => {
    const entry: Entry = { node, parentName: parent?.names[0] }
    return {
        modified: entry,
        original: entry,
        pending: false,
        source,
        uuid,
    }
}
const NodeEditorContainer: FC<Props> = ({ children, ...props }) => {
    const contextValue = useReducer<Reducer<State, Action>, Props>(reducer, props, propsToState)
    const [, dispatch] = contextValue
    useEffect(
        () => dispatch({ type: "INITIALIZE", payload: propsToState(props) }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [dispatch, props.source, props.parent, props.uuid, props.value],
    )
    return <Context.Provider value={contextValue}>{children}</Context.Provider>
}
export default NodeEditorContainer
