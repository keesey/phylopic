import { JWT } from "@phylopic/source-models"
import { Hash } from "@phylopic/utils"
import axios from "axios"
import { useCallback } from "react"
import useAuthToken from "~/auth/hooks/useAuthToken"
import useListCountInvalidator from "./useListCountInvalidator"
import useListInvalidator from "./useListInvalidator"
import useSubmissionSWR from "./useSubmissionSWR"
const deleteSubmission = async (url: string, token: JWT): Promise<any> => {
    await axios({
        headers: { authorization: `Bearer ${token}` },
        method: "DELETE",
        url,
    })
    return null
}
const useSubmissionDeletor = (hash: Hash | undefined) => {
    const invalidateList = useListInvalidator("/api/submissions")
    const invalidateListCount = useListCountInvalidator("/api/submissions", -1)
    const { mutate } = useSubmissionSWR(hash)
    const token = useAuthToken()
    return useCallback(async () => {
        if (hash && token) {
            const url = `/api/submissions/${encodeURIComponent(hash)}`
            const promise = deleteSubmission(url, token)
            mutate(promise)
            await promise
            invalidateList()
            invalidateListCount()
        }
    }, [invalidateList, invalidateListCount, mutate, token, hash])
}
export default useSubmissionDeletor
