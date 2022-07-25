import { EmailAddress, UUID } from "@phylopic/utils"
import useSWR from "swr"
import useAuthorizedJSONFetcher from "~/auth/hooks/useAuthorizedJSONFetcher"
import { Submission } from "~/submission/Submission"
import useSubmissionKey from "./useSubmissionKey"
const useSubmissionSWR = (uuid: UUID | null) => {
    const key = useSubmissionKey(uuid)
    const fetcher = useAuthorizedJSONFetcher<Submission>()
    return useSWR<Submission>(key, fetcher)
}
export default useSubmissionSWR
