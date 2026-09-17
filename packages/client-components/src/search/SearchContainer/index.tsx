"use client"
import React, { ReactNode, useEffect } from "react"
import { BuildContext } from "../../builds"
import { SearchContext } from "../context"
import { State } from "../context/State"
import { reducer } from "./reducer"
const createInitialState = (text: string): State => ({
    externalMatches: [],
    externalResults: {},
    focused: false,
    imageResults: [],
    internalMatches: [],
    nodeResults: [],
    resolutions: {},
    resolvedNodes: {},
    text,
})
export interface SearchContainerProps {
    children?: ReactNode
    initialText?: string
}
export const SearchContainer: React.FC<SearchContainerProps> = ({ children, initialText = "" }) => {
    const [build] = React.useContext(BuildContext) ?? []
    const [prevBuild, setPrevBuild] = React.useState(build)
    const contextValue = React.useReducer(reducer, [initialText], () => createInitialState(initialText))
    const [, dispatch] = contextValue
    useEffect(() => {
        return () => dispatch({ type: "RESET" })
    }, [dispatch])
    React.useEffect(() => {
        if (prevBuild !== build) {
            setPrevBuild(build)
            dispatch({ type: "RESET_INTERNAL" })
        }
    }, [build, dispatch, prevBuild])
    return <SearchContext.Provider value={contextValue}>{children}</SearchContext.Provider>
}
