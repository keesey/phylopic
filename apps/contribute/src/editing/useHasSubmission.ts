import { UUID } from "@phylopic/utils"
import { useMemo } from "react"
import useSWR from "swr"
import useAuthorizedExistenceFetcher from "~/auth/hooks/useAuthorizedExistenceFetcher"
import useContributorUUID from "~/auth/hooks/useContributorUUID"
const useHasSubmission = (uuid: UUID) => {
    const contributorUUID = useContributorUUID()
    const submissionKey = useMemo(
        () => (uuid && contributorUUID ? `/api/submissions/${encodeURIComponent(uuid)}` : null),
        [contributorUUID, uuid],
    )
    const fetchExistence = useAuthorizedExistenceFetcher()
    const { data } = useSWR(submissionKey, fetchExistence)
    return data
}
export default useHasSubmission
