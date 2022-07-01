import { BuildContext } from "@phylopic/utils-api"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import { FC, ReactNode, useContext, useEffect, useReducer, useState } from "react"
import SearchContext from "../context"
import { State } from "../context/State"
import reducer from "./reducer"
const EOLSearch = dynamic(() => import("../sources/EOLSearch"), { ssr: false })
const OTOLAutocompleteName = dynamic(() => import("../sources/OTOLAutocompleteName"), { ssr: false })
const OTOLResolve = dynamic(() => import("../sources/OTOLResolve"), { ssr: false })
const PhyloPicAutocomplete = dynamic(() => import("../sources/PhyloPicAutocomplete"), { ssr: false })
const PhyloPicNodeSearch = dynamic(() => import("../sources/PhyloPicNodeSearch"), { ssr: false })
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
    return (
        <SearchContext.Provider value={contextValue}>
            <PhyloPicAutocomplete />
            {/*<PhyloPicImageSearch />*/}
            <PhyloPicNodeSearch />
            <OTOLAutocompleteName />
            <OTOLResolve />
            <EOLSearch />
            {children}
        </SearchContext.Provider>
    )
}
export default SearchContainer
