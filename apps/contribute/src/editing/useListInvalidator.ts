import { useCallback } from "react"
import useSWR from "swr"
const useListInvalidator = (endpoint: string) => {
    const { mutate } = useSWR(endpoint)
    return useCallback(() => {
        mutate(undefined, { revalidate: true })
    }, [mutate])
}
export default useListInvalidator
