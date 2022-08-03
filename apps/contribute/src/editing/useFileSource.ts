import { UUID } from "@phylopic/utils"
import { useMemo } from "react"
import useSWR from "swr"
import useAuthorizedExistenceFetcher from "~/auth/hooks/useAuthorizedExistenceFetcher"
import useContributorUUID from "~/auth/hooks/useContributorUUID"
const useFileSource = (uuid: UUID) => {
    const contributorUUID = useContributorUUID()
    const sourceKey = useMemo(() => (uuid ? `/api/images/${encodeURIComponent(uuid)}/source` : null), [uuid])
    const submissionKey = useMemo(
        () =>
            uuid && contributorUUID
                ? `/api/submissions/${encodeURIComponent(uuid)}/source/${encodeURIComponent(contributorUUID)}`
                : null,
        [contributorUUID, uuid],
    )
    const fetchExistence = useAuthorizedExistenceFetcher()
    const sourceExistsSWR = useSWR<boolean, any, { url: string; method: "HEAD" } | null>(
        sourceKey ? { url: sourceKey, method: "HEAD" } : null,
        fetchExistence,
        {
            errorRetryInterval: 60 * 1000,
        },
    )
    const submissionExistsSWR = useSWR<boolean, any, { url: string; method: "HEAD" } | null>(
        submissionKey ? { url: submissionKey, method: "HEAD" } : null,
        fetchExistence,
    )
    const isValidating = sourceExistsSWR.isValidating || submissionExistsSWR.isValidating
    const error = submissionExistsSWR.error ?? sourceExistsSWR.error
    const data = useMemo(() => {
        if (submissionKey && submissionExistsSWR.data) {
            return submissionKey
        }
        if (sourceKey && sourceExistsSWR.data) {
            return sourceKey
        }
    }, [sourceExistsSWR.data, sourceKey, submissionExistsSWR.data, submissionKey])
    return { data, error, isValidating, isSource: data === sourceKey }
}
export default useFileSource
