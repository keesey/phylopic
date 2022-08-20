import { useMemo } from "react"
import useSWR from "swr"
import useAuthorizedJSONFetcher from "~/auth/hooks/useAuthorizedJSONFetcher"
import { ImageFilter } from "~/pagination/ImageFilter"
const useImageCount = (filter: ImageFilter) => {
    const key = useMemo(() => `/api/imagecount?filter=${encodeURIComponent(filter)}`, [filter])
    const fetcher = useAuthorizedJSONFetcher<{ total: number }>()
    const { data } = useSWR(key, fetcher)
    return data?.total
}
export default useImageCount
