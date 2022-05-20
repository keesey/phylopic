import { Contribution, NodeIdentifier, Source } from "@phylopic/source-models"
import { ImageMediaType } from "@phylopic/utils"
import React, { FC, ReactNode, Reducer, useEffect, useReducer } from "react"
import { Action } from "./Actions"
import Context from "./Context"
import reducer from "./reducer"
import { Entry, State } from "./State"

export type Props = {
    children?: ReactNode
    lineage: readonly NodeIdentifier[]
    mediaType: ImageMediaType
    source: Source
    value: Contribution
}
const propsToState = ({ mediaType, lineage, source, value }: Props): State => {
    const entry: Entry = { contribution: value, lineage }
    return {
        mediaType,
        modified: entry,
        original: entry,
        pending: false,
        source,
        uuid: value.uuid,
    }
}
const SubmissionEditorContainer: FC<Props> = ({ children, ...props }) => {
    const contextValue = useReducer<Reducer<State, Action>, Props>(reducer, props, propsToState)
    const [, dispatch] = contextValue
    useEffect(
        () => dispatch({ type: "INITIALIZE", payload: propsToState(props) }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [dispatch, props.mediaType, props.lineage, props.source, props.value],
    )
    return <Context.Provider value={contextValue}>{children}</Context.Provider>
}
export default SubmissionEditorContainer
