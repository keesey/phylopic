import useSWR from "swr"
import useAuthorizedJSONFetcher from "~/auth/hooks/useAuthorizedJSONFetcher"
const useSubmissionCount = () => {
    const fetcher = useAuthorizedJSONFetcher<number>()
    return useSWR("/api/submissions?total=items", fetcher).data
}
export default useSubmissionCount
