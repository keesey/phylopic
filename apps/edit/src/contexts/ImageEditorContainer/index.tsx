import { Entity, Image, Node, Source } from "@phylopic/source-models"
import { ImageMediaType, UUID } from "@phylopic/utils"
import { FC, ReactNode, Reducer, useEffect, useReducer } from "react"
import { Action } from "./Actions"
import Context from "./Context"
import reducer from "./reducer"
import { Entry, State } from "./State"

export type Props = {
    children?: ReactNode
    lineage: readonly Entity<Node>[]
    mediaType: ImageMediaType
    source: Source
    uuid: UUID
    value: Image
}
const propsToState = ({ mediaType, lineage, source, uuid, value }: Props): State => {
    const entry: Entry = { image: value, lineage }
    return {
        source,
        mediaType,
        modified: entry,
        original: entry,
        pending: false,
        uuid,
    }
}
const ImageEditorContainer: FC<Props> = ({ children, ...props }) => {
    const contextValue = useReducer<Reducer<State, Action>, Props>(reducer, props, propsToState)
    const [, dispatch] = contextValue
    useEffect(
        () => dispatch({ type: "INITIALIZE", payload: propsToState(props) }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [dispatch, props.mediaType, props.lineage, props.source, props.uuid, props.value],
    )
    return <Context.Provider value={contextValue}>{children}</Context.Provider>
}
export default ImageEditorContainer
