import { useCallback } from "react"
import useSWR from "swr"
const useListCountInvalidator = (endpoint: string, delta: number) => {
    const { data, mutate } = useSWR(`${endpoint}?count=total`)
    return useCallback(() => {
        mutate(undefined, { optimisticData: data + delta, revalidate: true })
    }, [data, delta, mutate])
}
export default useListCountInvalidator
