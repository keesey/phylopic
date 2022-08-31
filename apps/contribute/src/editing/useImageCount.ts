import useSWR from "swr"
import useAuthorizedJSONFetcher from "~/auth/hooks/useAuthorizedJSONFetcher"
const useImageCount = () => {
    const fetcher = useAuthorizedJSONFetcher<number>()
    const { data } = useSWR("/api/images?total=items", fetcher)
    return data
}
export default useImageCount
