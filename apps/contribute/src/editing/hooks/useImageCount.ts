import { useMemo } from "react"
import useSWR from "swr"
import useAuthorizedJSONFetcher from "~/auth/hooks/useAuthorizedJSONFetcher"
import { ImageFilter } from "~/pagination/ImageFilter"
const useImageCount = (filter: ImageFilter) => {
    const key = useMemo(() => `/api/imagecount?filter=${encodeURIComponent(filter)}`, [filter])
    const fetcher = useAuthorizedJSONFetcher()
    const { data } = useSWR<number>(key, fetcher)
    return data
}
export default useImageCount
