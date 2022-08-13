import { Contributor } from "@phylopic/source-models"
import useSWR from "swr"
import useAuthorizedJSONFetcher from "../auth/hooks/useAuthorizedJSONFetcher"
import useContributorUUID from "./useContributorUUID"
const useContributorSWR = () => {
    const uuid = useContributorUUID()
    const fetcher = useAuthorizedJSONFetcher<Contributor>()
    return useSWR<Contributor>(uuid ? `/api/contributors/${encodeURIComponent(uuid)}` : null, fetcher)
}
export default useContributorSWR
