import { ISOTimestamp, UUID } from "@phylopic/utils"
import axios from "axios"
import { useCallback } from "react"
import { SWRResponse } from "swr"
const usePatcher = <T extends { modified: ISOTimestamp }>(
    key: string,
    response: SWRResponse<T & { uuid: UUID }, unknown>,
) => {
    const { data, mutate } = response
    return useCallback(
        (value: Partial<T>) => {
            if (data === undefined) {
                throw new Error("Still loading!")
            }
            const newData = { ...data, ...value, modified: new Date().toISOString() }
            mutate(
                async () => {
                    await axios.patch(key, newData)
                    return newData
                },
                { optimisticData: newData, revalidate: true, rollbackOnError: true },
            )
        },
        [data, key, mutate],
    )
}
export default usePatcher
