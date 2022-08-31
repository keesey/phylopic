import { Submission } from "@phylopic/source-models"
import { UUID } from "@phylopic/utils"
import { useMemo } from "react"
import useSWR from "swr"
import useAuthorizedJSONFetcher from "~/auth/hooks/useAuthorizedJSONFetcher"
const useSubmissionSWR = (uuid: UUID | undefined) => {
    const key = useMemo(() => (uuid ? `/api/submissions/${encodeURIComponent(uuid)}` : null), [uuid])
    const fetcher = useAuthorizedJSONFetcher<Submission & { uuid: UUID }>()
    return useSWR(key, fetcher)
}
export default useSubmissionSWR
