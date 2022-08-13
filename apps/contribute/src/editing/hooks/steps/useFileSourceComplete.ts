import useSWR from "swr"
import useAuthorizedExistenceFetcher from "~/auth/hooks/useAuthorizedExistenceFetcher"
import useImageSrc from "../useImageSrcSWR"
const useFileSourceComplete = () => {
    const url = useImageSrc()
    const key = url ? { url, method: "HEAD" } : null
    const fetcher = useAuthorizedExistenceFetcher()
    const { data } = useSWR(key, fetcher)
    return data
}
export default useFileSourceComplete
