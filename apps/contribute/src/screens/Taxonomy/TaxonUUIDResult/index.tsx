import { isUUIDv4, UUID } from "@phylopic/utils"
import { FC, useCallback, useEffect, useMemo, useState } from "react"
import { SearchEntry } from "~/search/SearchEntry"
import ExternalResult from "./ExternalResult"
import ParentUUIDResult from "./ParentUUIDResult"
import SearchEntryResult from "./SearchEntryResult"
export type Props = {
    onCancel?: () => void
    onComplete?: (result: UUID) => void
    searchTerm: string
}
const TaxonUUIDResult: FC<Props> = ({ onCancel, onComplete, searchTerm }) => {
    const [entry, setEntry] = useState<SearchEntry | null>(null)
    const [nodeUUID, setNodeUUID] = useState<UUID | null>(null)
    const handleSearchEntryResultCancel = useCallback(() => {
        setEntry(null)
        onCancel?.()
    }, [onCancel])
    const needParent = useMemo(
        () => entry?.authority === "phylopic.org" && entry?.namespace === "nodes" && !isUUIDv4(entry?.objectID),
        [entry],
    )
    const resolveExternal = useMemo(
        () => Boolean(entry && (entry.authority !== "phylopic.org" || entry.namespace !== "nodes")),
        [entry],
    )
    useEffect(() => {
        if (entry?.authority === "phylopic.org" && entry?.namespace === "nodes" && isUUIDv4(entry?.objectID)) {
            onComplete?.(entry.objectID)
        } else if (isUUIDv4(nodeUUID)) {
            onComplete?.(nodeUUID)
        }
    }, [entry, nodeUUID])
    return (
        <>
            <SearchEntryResult onCancel={handleSearchEntryResultCancel} onComplete={setEntry} searchTerm={searchTerm} />
            {needParent && entry && <ParentUUIDResult name={entry.name} onComplete={setNodeUUID} />}
            {resolveExternal && entry && (
                <ExternalResult
                    authority={entry.authority}
                    namespace={entry.namespace}
                    objectID={entry.objectID}
                    onComplete={setNodeUUID}
                />
            )}
        </>
    )
}
export default TaxonUUIDResult
