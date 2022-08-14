import { UUID } from "@phylopic/utils"
import useSWR from "swr"
import useAuthorizedExistenceFetcher from "~/auth/hooks/useAuthorizedExistenceFetcher"
import useImageSrc from "../useImageSrcSWR"
const useFileSourceComplete = (uuid: UUID | undefined) => {
    const url = useImageSrc(uuid)
    const key = url ? { url, method: "HEAD" } : null
    const fetcher = useAuthorizedExistenceFetcher()
    const { data } = useSWR(key, fetcher)
    return data
}
export default useFileSourceComplete
