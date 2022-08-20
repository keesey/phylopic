import { UUID } from "@phylopic/utils"
import { FC, useEffect, useMemo } from "react"
import { SearchEntry } from "~/search/SearchEntry"
import ExternalImporter from "./ExternalImporter"
export type Props = {
    entry: SearchEntry
    onComplete: (uuid: UUID) => void
}
const SearchSelector: FC<Props> = ({ entry, onComplete }) => {
    const isExternal = useMemo(
        () => entry.authority !== "phylopic.org" || entry.namespace !== "nodes",
        [entry.authority, entry.namespace],
    )
    useEffect(() => {
        if (!isExternal) {
            onComplete(entry.objectID)
        }
    }, [entry.objectID, isExternal, onComplete])
    if (!isExternal) {
        return null
    }
    return <ExternalImporter external={entry} onComplete={onComplete} />
}
export default SearchSelector
