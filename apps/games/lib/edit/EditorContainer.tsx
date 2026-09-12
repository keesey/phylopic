"use client"
import { Dispatch, FC, PropsWithChildren, createContext, useEffect, useReducer } from "react"
import { EditorState } from "./EditorState"
import { Action } from "./actions"
import reducer from "./reducer"
export type EditorContainerProps<TModel> = PropsWithChildren<{
    data: TModel
}>
export const EditorContext = createContext<Readonly<[EditorState<unknown>, Dispatch<Action<unknown>>]> | undefined>(
    undefined,
)
const DEFAULT_STATE: EditorState<unknown> = {
    currentIndex: -1,
    history: [],
}
export const EditorContainer: FC<EditorContainerProps<unknown>> = ({ children, data }) => {
    const contextValue = useReducer(reducer, DEFAULT_STATE)
    const [, dispatch] = contextValue
    useEffect(() => {
        dispatch({ type: "INITIALIZE", payload: data })
    }, [data, dispatch])
    return <EditorContext.Provider value={contextValue}>{children}</EditorContext.Provider>
}
