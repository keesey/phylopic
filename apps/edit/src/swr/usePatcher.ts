import { ISOTimestamp, UUID } from "@phylopic/utils"
import axios from "axios"
import { useCallback } from "react"
import { SWRResponse } from "swr"
const usePatcher = <T extends { modified: ISOTimestamp }>(
    key: string,
    response: SWRResponse<T & { uuid: UUID }, unknown>,
) =>
    useCallback(
        (value: Partial<T>) => {
            if (response.data === undefined) {
                throw new Error("Still loading!")
            }
            const newData = { ...response.data, ...value, modified: new Date().toISOString() }
            response.mutate(
                async () => {
                    await axios.patch(key, newData)
                    return newData
                },
                { optimisticData: newData, revalidate: true, rollbackOnError: true },
            )
        },
        [key, response.data, response.mutate],
    )
export default usePatcher
