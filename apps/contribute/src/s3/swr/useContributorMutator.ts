import { Contributor, isContributor } from "@phylopic/source-models"
import { UUID } from "@phylopic/utils"
import axios from "axios"
import { useCallback } from "react"
import { SWRResponse } from "swr"
import useAuthToken from "~/auth/hooks/useAuthToken"
import { JWT } from "~/auth/models/JWT"
import useContributorKey from "./useContributorKey"
const putMeta = async (key: string, token: JWT, newValue: Contributor) => {
    await axios.put(key, newValue, {
        headers: { authorization: `Bearer ${token}` },
    })
    return newValue
}
const patchMeta = async (key: string, token: JWT, newValue: Partial<Contributor>, newData: Contributor) => {
    await axios.patch(key, newValue, {
        headers: { authorization: `Bearer ${token}` },
    })
    return newData
}
const useContributorMutator = (uuid: UUID | null, swr: Pick<SWRResponse<Contributor>, "data" | "mutate">) => {
    const token = useAuthToken()
    const key = useContributorKey(uuid)
    return useCallback(
        (newValue: Partial<Contributor>) => {
            if (key && token) {
                if (isContributor(newValue)) {
                    swr.mutate(putMeta(key, token, newValue), { optimisticData: newValue, rollbackOnError: true })
                } else if (swr.data) {
                    const newData = { ...swr.data, ...newValue }
                    swr.mutate(patchMeta(key, token, newValue, newData), {
                        optimisticData: newData,
                        rollbackOnError: true,
                    })
                }
            }
        },
        [key, swr.data, swr.mutate, token],
    )
}
export default useContributorMutator
