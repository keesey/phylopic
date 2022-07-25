import { UUID } from "@phylopic/utils"
import axios from "axios"
import { useCallback } from "react"
import { SWRResponse } from "swr"
import useAuthToken from "~/auth/hooks/useAuthToken"
import { JWT } from "~/auth/models/JWT"
import { Submission } from "~/submission/Submission"
import useSubmissionKey from "./useSubmissionKey"
const putSubmission = async (key: string, token: JWT, newValue: Partial<Submission>) => {
    await axios.put(key, newValue, {
        headers: { authorization: `Bearer ${token}` },
    })
    return newValue
}
const useSubmissionMutator = (uuid: UUID | null, swr: Pick<SWRResponse<Partial<Submission>>, "data" | "mutate">) => {
    const token = useAuthToken()
    const key = useSubmissionKey(uuid)
    return useCallback(
        (newValue: Partial<Submission>) => {
            const newData = { ...swr.data, ...newValue }
            if (key && token) {
                swr.mutate(putSubmission(key, token, newData), { optimisticData: newData, rollbackOnError: true })
            }
        },
        [key, swr.data, swr.mutate, token],
    )
}
export default useSubmissionMutator
