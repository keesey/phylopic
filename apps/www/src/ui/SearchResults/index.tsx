import { SearchContext, useExternalResolutions } from "@phylopic/search"
import { FC, useContext, useMemo } from "react"
import IllustratedNodeView from "~/views/IllustratedNodeView"
import SearchAside from "../SearchAside"
import ExternalResolutionCaption from "./ExternalResolutionCaption"
import styles from "./index.module.scss"
export interface Props {
    maxResults?: number
}
const SearchResults: FC<Props> = ({ maxResults = 32 }) => {
    const [state] = useContext(SearchContext) ?? []
    const nodeResults = useMemo(() => (state?.nodeResults ?? []).slice(0, maxResults), [maxResults, state?.nodeResults])
    const hasNodeResults = nodeResults.length > 0
    const resolutions = useExternalResolutions(maxResults)
    const hasResolutions = resolutions.length > 0
    if (!state) {
        return null
    }
    if (!state.text) {
        return <SearchAside />
    }
    return (
        <aside>
            <h2 key="header">Search Results</h2>
            {!hasNodeResults && !hasResolutions && (
                <p className={styles.noResults} key="none">
                    No results found.
                </p>
            )}
            {(hasNodeResults || hasResolutions) && (
                <div className={styles.results}>
                    {nodeResults.map(node => (
                        <IllustratedNodeView key={node.uuid} value={node} short />
                    ))}
                    {resolutions.map(resolution => (
                        <IllustratedNodeView
                            key={resolution.uuid}
                            caption={<ExternalResolutionCaption value={resolution} />}
                            value={resolution.node}
                            short
                        />
                    ))}
                </div>
            )}
        </aside>
    )
}
export default SearchResults
