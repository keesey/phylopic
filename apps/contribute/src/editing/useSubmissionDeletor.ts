import { Hash } from "@phylopic/utils"
import { useCallback } from "react"
import useAuthToken from "~/auth/hooks/useAuthToken"
import useAuthorizedRequest from "~/auth/hooks/useAuthorizedRequest"
import useListCountInvalidator from "./useListCountInvalidator"
import useListInvalidator from "./useListInvalidator"
import useSubmissionSWR from "./useSubmissionSWR"
const useSubmissionDeletor = (hash: Hash | undefined) => {
    const invalidateList = useListInvalidator("/api/submissions")
    const invalidateListCount = useListCountInvalidator("/api/submissions", -1)
    const { mutate } = useSubmissionSWR(hash)
    const request = useAuthorizedRequest()
    const token = useAuthToken()
    return useCallback(async () => {
        if (hash && token) {
            const url = `/api/submissions/${encodeURIComponent(hash)}`
            const promise = request({ method: "DELETE", url }).then<any>(() => null)
            mutate(promise)
            await promise
            invalidateList()
            invalidateListCount()
        }
    }, [invalidateList, invalidateListCount, mutate, request, token, hash])
}
export default useSubmissionDeletor
