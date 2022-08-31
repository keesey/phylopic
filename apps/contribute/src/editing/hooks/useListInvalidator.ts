import { useCallback } from "react"
import useSWR from "swr"
const useListInvalidator = (endpoint: string) => {
    const { mutate: mutatePage } = useSWR(endpoint)
    const { mutate: mutateCount } = useSWR(`${endpoint}?count=total`)
    return useCallback(() => {
        mutateCount(async (x: any) => x, { revalidate: true })
        mutatePage(async (x: any) => x, { revalidate: true })
    }, [mutateCount, mutatePage])
}
export default useListInvalidator
