import React, { FC, ReactNode, Reducer, useEffect, useReducer } from "react"
import { Action } from "./Actions"
import Context from "./Context"
import reducer from "./reducer"
import { Arc, Entry, NodesMap, State } from "./State"

export type Props = {
    arcs: readonly Arc[]
    children?: ReactNode
    nodesMap: NodesMap
}
const findRoot = (arcs: readonly Arc[], nodesMap: NodesMap) =>
    Object.keys(nodesMap).find(uuid => arcs.every(([, tail]) => tail !== uuid))
const propsToState = ({ arcs, nodesMap }: Props): State => {
    const entry: Entry = { arcs, nodesMap }
    return {
        modified: entry,
        original: entry,
        pending: false,
        root: findRoot(arcs, nodesMap),
    }
}
const PhylogenyEditorContainer: FC<Props> = ({ children, ...props }) => {
    const contextValue = useReducer<Reducer<State, Action>, Props>(reducer, props, propsToState)
    const [, dispatch] = contextValue
    useEffect(
        () => dispatch({ type: "INITIALIZE", payload: propsToState(props) }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [dispatch, props.arcs, props.nodesMap],
    )
    return <Context.Provider value={contextValue}>{children}</Context.Provider>
}
export default PhylogenyEditorContainer
