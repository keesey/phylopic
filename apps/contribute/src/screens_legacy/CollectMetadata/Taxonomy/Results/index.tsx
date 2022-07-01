import { parseNomen } from "parse-nomen"
import { FC, useCallback, useEffect, useMemo } from "react"
import useSearch from "~/search/useSearch"
import Loader from "~/ui/Loader"
import NameView from "~/ui/NameView"
import { TaxonomyResult } from "../TaxonomyResult"
interface Props {
    onCancel?: () => void
    onComplete?: (result: TaxonomyResult) => void
    searchTerm: string
}
const Results: FC<Props> = ({ onCancel, onComplete, searchTerm }) => {
    const search = useSearch(searchTerm)
    useEffect(() => {
        if (search.data) {
            onComplete?.({ specific: search.data })
        }
    }, [onComplete, search.data])
    const parsedSearchTerm = useMemo(() => parseNomen(searchTerm), [searchTerm])
    const handleUnknownButtonClick = useCallback(() => {
        onComplete?.({
            specific: {
                identifier: null,
                name: parsedSearchTerm,
            },
        })
    }, [onComplete, parsedSearchTerm])
    if (!searchTerm) {
        return null
    }
    if (search.pending) {
        return (
            <section>
                <p>Looking that up&hellip;</p>
                <Loader />
            </section>
        )
    }
    if (!search.data) {
        return (
            <section>
                <p>
                    Huh. &ldquo;
                    <NameView defaultText="<redacted>" value={parsedSearchTerm} />
                    .&rdquo; I have never heard of that.
                </p>
                <p>Are you sure you spelled it right?</p>
                <nav>
                    <button className="cta" onClick={handleUnknownButtonClick}>
                        Oh, I&apos;m sure.
                    </button>
                    <button className="cta" onClick={onCancel}>
                        Actually &hellip; maybe not?
                    </button>
                </nav>
            </section>
        )
    }
    return (
        <section>
            <p>
                <strong>
                    <NameView value={search.data.name} />
                </strong>
            </p>
            <p>{search.data.identifier[0] === "phylopic.org" && "Cool!"}</p>
            <p>{search.data.identifier[0] !== "phylopic.org" && "Nice, this will be our first one!"}</p>
        </section>
    )
}
export default Results
