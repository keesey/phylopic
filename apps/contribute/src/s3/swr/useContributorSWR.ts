import { Contributor } from "@phylopic/source-models"
import { UUID } from "@phylopic/utils"
import useSWR from "swr"
import useAuthorizedJSONFetcher from "~/auth/hooks/useAuthorizedJSONFetcher"
import useContributorKey from "./useContributorKey"
const useContributorSWR = (uuid: UUID | null) => {
    const key = useContributorKey(uuid)
    console.debug(key)
    const fetcher = useAuthorizedJSONFetcher<Contributor>()
    return useSWR<Contributor>(key, fetcher)
}
export default useContributorSWR
