import useSWR from "swr"
import useAuthorizedJSONFetcher from "~/auth/hooks/useAuthorizedJSONFetcher"
import { ImageFilter } from "~/pagination/ImageFilter"
const useImageCount = (filter: ImageFilter) => {
    const fetcher = useAuthorizedJSONFetcher<{ accepted: number, incomplete: number, submitted: number, withdrawn: number }>()
    const { data } = useSWR("/api/imagecount", fetcher)
    return data?.[filter]
}
export default useImageCount
