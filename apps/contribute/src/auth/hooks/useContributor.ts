import { Contributor } from "@phylopic/source-models"
import useSWR from "swr"
import useAuthorizedJSONFetcher from "./useAuthorizedJSONFetcher"
import useContributorUUID from "./useContributorUUID"
const useContributor = (): Contributor | null => {
    const uuid = useContributorUUID()
    const fetcher = useAuthorizedJSONFetcher<Contributor>()
    const { data } = useSWR<Contributor>(uuid ? `/api/contributors/${encodeURIComponent(uuid)}` : null, fetcher)
    return data ?? null
}
export default useContributor
