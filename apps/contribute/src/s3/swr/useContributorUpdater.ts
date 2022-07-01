import { Contributor } from "@phylopic/source-models"
import { UUID } from "@phylopic/utils"
import axios from "axios"
import { useCallback } from "react"
import { SWRResponse } from "swr"
import useAuthToken from "~/auth/hooks/useAuthToken"
import { JWT } from "~/auth/models/JWT"
import useContributorKey from "./useContributorKey"
const putContributor = async (key: string, token: JWT, newValue: Contributor) => {
    await axios.put(key, newValue, {
        headers: { authorization: `Bearer ${token}` },
    })
    return newValue
}
const useContributorUpdater = (uuid: UUID, swr: Pick<SWRResponse<Contributor>, "data" | "mutate">) => {
    const token = useAuthToken()
    const key = useContributorKey(uuid)
    return useCallback(
        (newValue: Contributor) => {
            if (key && token) {
                swr.mutate(putContributor(key, token, newValue), { optimisticData: newValue, rollbackOnError: true })
            }
        },
        [key, swr.data, swr.mutate, token],
    )
}
export default useContributorUpdater
