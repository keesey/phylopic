import { compareStrings } from "@phylopic/utils/dist/comparison"
import { useContext, useMemo } from "react"
import SearchContext from "../context"
import getSortIndex from "../utils/getSortIndex"
const useMatches = (maxLength: number) => {
    const [state] = useContext(SearchContext) ?? []
    const { externalMatches, internalMatches, text } = state || {}
    return useMemo(() => {
        if (text && (externalMatches?.length || internalMatches?.length)) {
            return [...new Set([...(internalMatches ?? []), ...(externalMatches ?? [])].filter(Boolean))]
                .sort((a, b) => getSortIndex(a, text) - getSortIndex(b, text) || compareStrings(a, b))
                .slice(0, maxLength)
        }
        return []
    }, [externalMatches, internalMatches, maxLength, text])
}
export default useMatches
