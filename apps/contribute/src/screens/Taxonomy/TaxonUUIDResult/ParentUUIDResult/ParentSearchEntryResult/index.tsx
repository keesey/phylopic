import { Loader } from "@phylopic/ui"
import { isUUIDv4, UUID } from "@phylopic/utils"
import { FC, useEffect } from "react"
import usePhyloPicSearch from "~/search/usePhyloPicSearch"
import NameView from "~/ui/NameView"
interface Props {
    onComplete?: (uuid: UUID) => void
    searchTerm: string
}
const ParentSearchEntryResult: FC<Props> = ({ onComplete, searchTerm }) => {
    const search = usePhyloPicSearch(searchTerm)
    useEffect(() => {
        const uuid = search.data?.objectID
        if (isUUIDv4(uuid)) {
            onComplete?.(uuid)
        }
    }, [onComplete, search.data?.objectID])
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
                <p>Sorry, I don&rsquo;t know that one. Maybe try a larger group?</p>
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
            <p>Got it!</p>
        </section>
    )
}
export default ParentSearchEntryResult
