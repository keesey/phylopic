import { Node } from "@phylopic/source-models"
import { UUID } from "@phylopic/utils"
import useSWR from "swr"
import useAuthorizedJSONFetcher from "~/auth/hooks/useAuthorizedJSONFetcher"
const useNode = (uuid?: UUID) => {
    const fetcher = useAuthorizedJSONFetcher<Node & { uuid: UUID }>()
    return useSWR(uuid ? `/api/nodes/${encodeURIComponent(uuid)}` : null, fetcher)
}
export default useNode
