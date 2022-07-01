import { EmailAddress } from "@phylopic/utils"
import axios from "axios"
import { useCallback } from "react"
import { SWRResponse } from "swr"
import useAuthToken from "~/auth/hooks/useAuthToken"
import { JWT } from "~/auth/models/JWT"
import Payload from "~/auth/models/Payload"
import useContributorMetaKey from "./useContributorMetaKey"
const putMeta = async (key: string, token: JWT, newValue: Payload) => {
    await axios.put(key, newValue, {
        headers: { authorization: `Bearer ${token}` },
    })
    return newValue
}
const useContributorMetaUpdater = (
    emailAddress: EmailAddress | null,
    swr: Pick<SWRResponse<Payload>, "data" | "mutate">,
) => {
    const token = useAuthToken()
    const key = useContributorMetaKey(emailAddress)
    return useCallback(
        (newValue: Payload) => {
            if (key && token) {
                swr.mutate(putMeta(key, token, newValue), { optimisticData: newValue, rollbackOnError: true })
            }
        },
        [key, swr.data, swr.mutate, token],
    )
}
export default useContributorMetaUpdater
