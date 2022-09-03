import { JWT, Submission } from "@phylopic/source-models"
import { Hash } from "@phylopic/utils"
import axios from "axios"
import { useCallback } from "react"
import useAuthToken from "~/auth/hooks/useAuthToken"
import useListInvalidator from "./useListInvalidator"
import useSubmissionSWR from "./useSubmissionSWR"
const patch = async (key: string, token: JWT, newValue: Partial<Submission>, newData: Submission) => {
    await axios.patch(key, newValue, {
        headers: { authorization: `Bearer ${token}` },
    })
    return newData
}
const useSubmissionMutator = (hash: Hash | undefined) => {
    const invalidate = useListInvalidator("/api/submissions")
    const { data, mutate } = useSubmissionSWR(hash)
    const token = useAuthToken()
    return useCallback(
        async (newValue: Partial<Submission>) => {
            if (data && hash && token) {
                const key = `/api/submissions/${encodeURIComponent(hash)}`
                const newData = { ...data, ...newValue } as Submission
                const promise = patch(key, token, newValue, newData)
                mutate(promise, {
                    optimisticData: newData,
                    rollbackOnError: true,
                })
                await promise
                invalidate()
            }
        },
        [data, hash, invalidate, mutate, token],
    )
}
export default useSubmissionMutator
