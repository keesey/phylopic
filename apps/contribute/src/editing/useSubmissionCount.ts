import useSWR from "swr"
import useAuthorizedJSONFetcher from "~/auth/hooks/useAuthorizedJSONFetcher"
const useSubmissionCount = () => {
    const fetcher = useAuthorizedJSONFetcher<number>()
    const { data } = useSWR("/api/submissions?total=items", fetcher)
    return data
}
export default useSubmissionCount
