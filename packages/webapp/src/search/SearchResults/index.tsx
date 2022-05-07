import { Nomen } from "@phylopic/utils"
import { FC, useContext, useMemo } from "react"
import IllustratedNodeView from "~/views/IllustratedNodeView"
import NomenView from "~/views/NomenView"
import SearchContext from "../context"
import useExternalResults from "../hooks/useExternalResolutions"
import ExternalResolutionCaption from "./ExternalResolutionCaption"
import styles from "./index.module.scss"
const EXAMPLE_SCIENTIFIC_NAME: Nomen = [{ class: "scientific", text: "Homo sapiens" }]
const EXAMPLE_VERNACULAR_NAME: Nomen = [{ class: "vernacular", text: "humans" }]
export interface Props {
    maxResults?: number
}
const SearchResults: FC<Props> = ({ maxResults = 32 }) => {
    const [state] = useContext(SearchContext) ?? []
    const nodeResults = useMemo(() => (state?.nodeResults ?? []).slice(0, maxResults), [maxResults, state?.nodeResults])
    const hasNodeResults = useMemo(() => Boolean(nodeResults.length), [nodeResults.length])
    const resolutions = useExternalResults(maxResults)
    const hasResolutions = useMemo(() => Boolean(resolutions.length), [resolutions.length])
    if (!state) {
        return null
    }
    if (!state.text) {
        return (
            <aside>
                <p>Use the search bar at the top of the page to search for a group of life forms.</p>
                <p>
                    Names may be scientific (e.g., <NomenView value={EXAMPLE_SCIENTIFIC_NAME} />) or informal (e.g.,{" "}
                    <NomenView value={EXAMPLE_VERNACULAR_NAME} />
                    ).
                </p>
            </aside>
        )
    }
    return (
        <aside>
            <h2 key="header">Search Results</h2>
            {!hasNodeResults && !hasResolutions && <p key="none">No results found.</p>}
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
