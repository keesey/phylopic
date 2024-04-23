import { compareStrings } from "@phylopic/utils"
import { useContext, useMemo } from "react"
import { SearchContext } from "../context"
import { getSortIndex } from "../utils/getSortIndex"
export const useMatches = (maxLength = Infinity) => {
    const [state] = useContext(SearchContext) ?? []
    const { externalMatches, internalMatches, text } = state || {}
    return useMemo(() => {
        if (text && (externalMatches?.length || internalMatches?.length)) {
            return Array.from(new Set([...(internalMatches ?? []), ...(externalMatches ?? [])].filter(Boolean)))
                .sort((a, b) => getSortIndex(a, text) - getSortIndex(b, text) || compareStrings(a, b))
                .slice(0, maxLength)
        }
        return []
    }, [externalMatches, internalMatches, maxLength, text])
}
