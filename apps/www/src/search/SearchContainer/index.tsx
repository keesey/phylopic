import { BuildContext } from "@phylopic/utils-api"
import { useRouter } from "next/router"
import { FC, ReactNode, useContext, useEffect, useReducer, useState } from "react"
import SearchContext from "../context"
import { State } from "../context/State"
import reducer from "./reducer"
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
export interface Props {
    children?: ReactNode
    initialText?: string
}
const SearchContainer: FC<Props> = ({ children, initialText = "" }) => {
    const [build] = useContext(BuildContext) ?? []
    const [prevBuild, setPrevBuild] = useState(build)
    const contextValue = useReducer(reducer, [initialText], () => createInitialState(initialText))
    const [, dispatch] = contextValue
    const { events } = useRouter()
    useEffect(() => {
        const handler = () => dispatch({ type: "RESET" })
        events.on("routeChangeStart", handler)
        return () => events.off("routeChangeStart", handler)
    }, [dispatch, events])
    useEffect(() => {
        if (prevBuild !== build) {
            setPrevBuild(build)
            dispatch({ type: "RESET_INTERNAL" })
        }
    }, [build, dispatch, prevBuild])
    return <SearchContext.Provider value={contextValue}>{children}</SearchContext.Provider>
}
export default SearchContainer
