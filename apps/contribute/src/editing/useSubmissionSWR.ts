import { Submission } from "@phylopic/source-models"
import { Hash, isHash } from "@phylopic/utils"
import { useMemo } from "react"
import useSWR from "swr"
import useAuthorizedJSONFetcher from "~/auth/hooks/useAuthorizedJSONFetcher"
const useSubmissionSWR = (hash: Hash | undefined) => {
    const key = useMemo(() => (isHash(hash) ? `/api/submissions/${encodeURIComponent(hash)}` : null), [hash])
    const fetcher = useAuthorizedJSONFetcher<Submission>()
    return useSWR(key, fetcher)
}
export default useSubmissionSWR
