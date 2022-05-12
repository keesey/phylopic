import { Node } from "@phylopic/source-models"
import { ISOTimestamp, Nomen, stringifyNormalized, UUID } from "@phylopic/utils"
import React, { FC, ReactNode, Reducer, useEffect, useMemo, useReducer } from "react"
import { Action } from "./Actions"
import Context from "./Context"
import reducer from "./reducer"
import { State } from "./State"

export type Props = {
    children?: ReactNode
    created: ISOTimestamp
    newCanonicalName: Nomen
    newUUID: UUID
    node: Node
    parentName?: Nomen
    relationship: "child" | "parent" | "sibling"
    uuid: UUID
}
const propsToState = ({ created, newCanonicalName, newUUID, node, relationship, uuid, parentName }: Props): State => {
    const newCanonicalNameJSON = stringifyNormalized(newCanonicalName)
    return {
        created: {
            parentName: relationship === "parent" ? node.names[0] : parentName,
            uuid: newUUID,
            value: {
                created,
                names: [newCanonicalName],
                parent: relationship === "parent" ? uuid : node.parent,
            },
        },
        original: {
            parentName: relationship === "child" ? newCanonicalName : parentName,
            uuid,
            value: {
                ...node,
                names:
                    node.names.length < 2
                        ? node.names
                        : node.names.filter(name => stringifyNormalized(name) !== newCanonicalNameJSON),
                parent: relationship === "child" ? newUUID : node.parent,
            },
        },
        pending: false,
    }
}
const NodeSplitEditorContainer: FC<Props> = ({ children, ...props }) => {
    const contextValue = useReducer<Reducer<State, Action>, Props>(reducer, props, propsToState)
    const [, dispatch] = contextValue
    const normalizedNewCanonicalName = useMemo(
        () => stringifyNormalized(props.newCanonicalName),
        [props.newCanonicalName],
    )
    const normalizedParentName = useMemo(() => stringifyNormalized(props.parentName), [props.parentName])
    const normalizedNode = useMemo(() => stringifyNormalized(props.node), [props.node])
    useEffect(
        () => dispatch({ type: "INITIALIZE", payload: propsToState(props) }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [
            dispatch,
            props.created,
            normalizedNewCanonicalName,
            props.newUUID,
            normalizedNode,
            props.relationship,
            props.uuid,
            normalizedParentName,
        ],
    )
    return <Context.Provider value={contextValue}>{children}</Context.Provider>
}
export default NodeSplitEditorContainer
