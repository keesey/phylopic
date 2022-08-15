import { Loader } from "@phylopic/ui"
import { parseNomen } from "parse-nomen"
import { FC, useCallback, useEffect, useMemo } from "react"
import { SearchEntry } from "~/search/SearchEntry"
import useSearch from "~/search/useSearch"
import ButtonNav from "~/ui/ButtonNav"
import NameView from "~/ui/NameView"
interface Props {
    onCancel?: () => void
    onComplete?: (result: SearchEntry) => void
    searchTerm: string
}
const SearchEntryResult: FC<Props> = ({ onCancel, onComplete, searchTerm }) => {
    const search = useSearch(searchTerm)
    useEffect(() => {
        if (search.data) {
            onComplete?.(search.data)
        }
    }, [onComplete, search.data])
    const parsedSearchTerm = useMemo(() => parseNomen(searchTerm), [searchTerm])
    const handleUnknownButtonClick = useCallback(() => {
        onComplete?.({
            authority: "phylopic.org",
            namespace: "nodes",
            objectID: "",
            name: parsedSearchTerm,
        })
    }, [onComplete, parsedSearchTerm])
    if (!searchTerm) {
        return null
    }
    if (search.pending) {
        return (
            <section>
                <p>Looking that up…</p>
                <Loader />
            </section>
        )
    }
    if (!search.data) {
        return (
            <section>
                <p>
                    Huh. “
                    <NameView defaultText="<name not found>" value={parsedSearchTerm} />
                    .” I have never heard of that.
                </p>
                <p>Are you sure you spelled it right?</p>
                <ButtonNav mode="horizontal">
                    {parsedSearchTerm.length > 0 && (
                        <button className="cta" onClick={handleUnknownButtonClick}>
                            Oh, I&rsquo;m sure.
                        </button>
                    )}
                    <button className="cta" onClick={onCancel}>
                        Actually &hellip; maybe not?
                    </button>
                </ButtonNav>
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
            <p>
                {search.data.authority === "phylopic.org" && "Cool!"}
                {search.data.authority !== "phylopic.org" && "Nice, this will be our first one!"}
            </p>
        </section>
    )
}
export default SearchEntryResult
