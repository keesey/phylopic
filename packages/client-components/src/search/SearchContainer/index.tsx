"use client"
import { type FC, type ReactNode, useContext, useEffect, useReducer, useState } from "react"
import { BuildContext } from "../../builds"
import { SearchContext } from "../context"
import type { State } from "../context/State"
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

export const SearchContainer: FC<SearchContainerProps> = ({ children, initialText = "" }) => {
    const [build] = useContext(BuildContext) ?? []
    const [prevBuild, setPrevBuild] = useState(build)
    const contextValue = useReducer(reducer, [initialText], () => createInitialState(initialText))
    const [, dispatch] = contextValue
    useEffect(() => {
        return () => dispatch({ type: "RESET" })
    }, [dispatch])
    useEffect(() => {
        if (prevBuild !== build) {
            setPrevBuild(build)
            dispatch({ type: "RESET_INTERNAL" })
        }
    }, [build, dispatch, prevBuild])
    return <SearchContext.Provider value={contextValue}>{children}</SearchContext.Provider>
}
