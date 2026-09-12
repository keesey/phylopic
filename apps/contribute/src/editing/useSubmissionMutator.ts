import { Submission } from "@phylopic/source-models"
import { Hash } from "@phylopic/utils"
import { useCallback } from "react"
import useAuthToken from "~/auth/hooks/useAuthToken"
import useAuthorizedRequest from "~/auth/hooks/useAuthorizedRequest"
import useListInvalidator from "./useListInvalidator"
import useSubmissionSWR from "./useSubmissionSWR"
const useSubmissionMutator = (hash: Hash | undefined) => {
    const invalidate = useListInvalidator("/api/submissions")
    const { data, mutate } = useSubmissionSWR(hash)
    const request = useAuthorizedRequest()
    const token = useAuthToken()
    return useCallback(
        async (newValue: Partial<Submission>) => {
            if (data && hash && token) {
                const url = `/api/submissions/${encodeURIComponent(hash)}`
                const newData = { ...data, ...newValue } as Submission
                const promise = request({ data: newValue, method: "PATCH", url }).then(() => newData)
                mutate(promise, {
                    optimisticData: newData,
                    rollbackOnError: true,
                })
                await promise
                invalidate()
            }
        },
        [data, hash, invalidate, mutate, request, token],
    )
}
export default useSubmissionMutator
