import { EmailAddress, UUID } from "@phylopic/utils"
import axios from "axios"
import { useCallback } from "react"
import { KeyedMutator } from "swr"
import useAuthToken from "~/auth/hooks/useAuthToken"
import { JWT } from "~/auth/models/JWT"
import { Submission } from "~/submission/Submission"
import useSubmissionKey from "./useSubmissionKey"
const putSubmission = async (key: string, token: JWT, newValue: Submission) => {
    await axios.put(key, newValue, {
        headers: { authorization: `Bearer ${token}` },
    })
    return newValue
}
const useSubmissionUpdater = (emailAddress: EmailAddress, uuid: UUID, mutate: KeyedMutator<Submission>) => {
    const token = useAuthToken()
    const key = useSubmissionKey(emailAddress, uuid)
    return useCallback(
        (newValue: Submission) => {
            if (key && token) {
                mutate(putSubmission(key, token, newValue), { optimisticData: newValue, rollbackOnError: true })
            }
        },
        [key, mutate, token],
    )
}
export default useSubmissionUpdater
