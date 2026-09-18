import axios from "axios"
import { useCallback } from "react"
import type { SWRResponse } from "swr"
const usePatcher = <T>(key: string, response: SWRResponse<T, unknown>) => {
    const { data, mutate } = response
    return useCallback(
        (value: Partial<T>) => {
            if (data === undefined) {
                throw new Error("Still loading!")
            }
            const newData = { ...data, ...value }
            mutate(
                async () => {
                    await axios.patch<T>(key, value)
                    return newData
                },
                { optimisticData: newData, revalidate: true, rollbackOnError: true },
            )
        },
        [data, key, mutate],
    )
}
export default usePatcher
