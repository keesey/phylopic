import { Contributor, isContributor, JWT } from "@phylopic/source-models"
import axios from "axios"
import { useCallback } from "react"
import useAuthToken from "~/auth/hooks/useAuthToken"
import useContributorSWR from "./useContributorSWR"
import useContributorUUID from "./useContributorUUID"
const put = async (key: string, token: JWT, newValue: Contributor) => {
    await axios.put(key, newValue, {
        headers: { authorization: `Bearer ${token}` },
    })
    return newValue
}
const patch = async (key: string, token: JWT, newValue: Partial<Contributor>, newData: Contributor) => {
    await axios.patch(key, newValue, {
        headers: { authorization: `Bearer ${token}` },
    })
    return newData
}
const useContributorMutator = () => {
    const { data, mutate } = useContributorSWR()
    const token = useAuthToken()
    const uuid = useContributorUUID()
    return useCallback(
        (newValue: Partial<Contributor>) => {
            if (uuid && token) {
                const key = `/api/contributors/${encodeURIComponent(uuid)}`
                if (isContributor(newValue)) {
                    mutate(put(key, token, newValue), { optimisticData: newValue, rollbackOnError: true })
                } else if (data) {
                    const newData = { ...data, ...newValue }
                    mutate(patch(key, token, newValue, newData), {
                        optimisticData: newData,
                        rollbackOnError: true,
                    })
                }
            }
        },
        [data, mutate, token, uuid],
    )
}
export default useContributorMutator
