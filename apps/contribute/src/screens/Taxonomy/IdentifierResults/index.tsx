import { NodeIdentifier } from "@phylopic/source-models"
import { Loader } from "@phylopic/ui"
import { parseNomen } from "parse-nomen"
import { FC, useCallback, useEffect, useMemo } from "react"
import useSearch from "~/search/useSearch"
import ButtonNav from "~/ui/ButtonNav"
import NameView from "~/ui/NameView"
interface Props {
    onCancel?: () => void
    onComplete?: (result: NodeIdentifier) => void
    searchTerm: string
}
const IdentifierResults: FC<Props> = ({ onCancel, onComplete, searchTerm }) => {
    const search = useSearch(searchTerm)
    useEffect(() => {
        if (search.data) {
            onComplete?.(search.data)
        }
    }, [onComplete, search.data])
    const parsedSearchTerm = useMemo(() => parseNomen(searchTerm), [searchTerm])
    const handleUnknownButtonClick = useCallback(() => {
        onComplete?.({
            identifier: null,
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
                    <NameView defaultText="<redacted>" value={parsedSearchTerm} />
                    .” I have never heard of that.
                </p>
                <p>Are you sure you spelled it right?</p>
                <ButtonNav mode="horizontal">
                    <button className="cta" onClick={handleUnknownButtonClick}>
                        Oh, I&rsquo;m sure.
                    </button>
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
            <p>{search.data.identifier.startsWith("phylopic.org/") && "Cool!"}</p>
            <p>{!search.data.identifier.startsWith("phylopic.org/") && "Nice, this will be our first one!"}</p>
        </section>
    )
}
export default IdentifierResults
