import { Image } from "@phylopic/source-models"
import { UUID } from "@phylopic/utils"
import useSWR from "swr"
import useAuthorizedJSONFetcher from "~/auth/hooks/useAuthorizedJSONFetcher"
const useImage = (uuid?: UUID) => {
    const fetcher = useAuthorizedJSONFetcher<Image & { uuid: UUID }>()
    return useSWR(uuid ? `/api/images/${encodeURIComponent(uuid)}` : null, fetcher)
}
export default useImage
