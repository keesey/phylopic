import { SearchContext, useExternalResolutions } from "@phylopic/ui"
import { FC, Fragment, useContext, useMemo } from "react"
import customEvents from "~/analytics/customEvents"
import IllustratedNodeView from "~/views/IllustratedNodeView"
import SearchAside from "../SearchAside"
import ExternalResolutionCaption from "./ExternalResolutionCaption"
import styles from "./index.module.scss"
import Container from "../Container"
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
            <Container>
                <h2 key="header">Search Results</h2>
                {!hasNodeResults && !hasResolutions && (
                    <p className={styles.message} key="none">
                        No results found.
                    </p>
                )}
                {(hasNodeResults || hasResolutions) && (
                    <Fragment key="some">
                        <p className={styles.message}>
                            Search powered in part by the{" "}
                            <a
                                href="//eol.org/"
                                onClick={() =>
                                    customEvents.clickLink("search_eol", "//eol.org/", "Encyclopedia of Life", "link")
                                }
                                rel="external"
                            >
                                Encyclopedia of Life
                            </a>
                            , the{" "}
                            <a
                                href="//tree.opentreeoflife.org/"
                                onClick={() =>
                                    customEvents.clickLink(
                                        "search_otol",
                                        "//tree.opentreeoflife.org/",
                                        "Open Tree of Life",
                                        "link",
                                    )
                                }
                                rel="external"
                            >
                                Open Tree of Life
                            </a>
                            , and the{" "}
                            <a
                                href="//paleobiodb.org/"
                                onClick={() =>
                                    customEvents.clickLink(
                                        "search_paleobiodb",
                                        "//paleobiodb.org/",
                                        "Paleobiology Database",
                                        "link",
                                    )
                                }
                                rel="external"
                            >
                                Paleobiology Database
                            </a>
                            .
                        </p>
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
                    </Fragment>
                )}
            </Container>
        </aside>
    )
}
export default SearchResults
