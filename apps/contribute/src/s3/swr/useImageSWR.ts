import { Image } from "@phylopic/source-models"
import { UUID } from "@phylopic/utils"
import useSWR from "swr"
import useAuthorizedJSONFetcher from "~/auth/hooks/useAuthorizedJSONFetcher"
import useImageKey from "./useImageKey"
const useImageSWR = (uuid: UUID | null) => {
    const key = useImageKey(uuid)
    const fetcher = useAuthorizedJSONFetcher<Image>()
    return useSWR<Image>(key, fetcher)
}
export default useImageSWR
