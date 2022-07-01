import { isUUID, UUID } from "@phylopic/utils"
import { useMemo } from "react"
import useSWR from "swr"
import useAuthorizedJSONFetcher, { AuthorizedJSONFetcherConfig } from "~/auth/hooks/useAuthorizedJSONFetcher"
const FETCHER_CONFIG: AuthorizedJSONFetcherConfig = {
    headers: {
        accept: "application/json",
    },
}
export type SubmissionFileMeta = {
    readonly complete: boolean
}
const useSubmissionFileMetaSWR = (uuid: UUID | null) => {
    const key = useMemo(
        () => (isUUID(uuid) ? `/api/s3/contribute/submissionfiles/${encodeURIComponent(uuid)}` : null),
        [uuid],
    )
    const fetcher = useAuthorizedJSONFetcher<SubmissionFileMeta>(FETCHER_CONFIG)
    return useSWR<SubmissionFileMeta>(key, fetcher)
}
export default useSubmissionFileMetaSWR
