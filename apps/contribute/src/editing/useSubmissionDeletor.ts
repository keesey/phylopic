import { JWT } from "@phylopic/source-models"
import { Hash } from "@phylopic/utils"
import axios from "axios"
import { useRouter } from "next/router"
import { useCallback } from "react"
import useAuthToken from "~/auth/hooks/useAuthToken"
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
    const invalidate = useListInvalidator("/api/submissions")
    const { mutate } = useSubmissionSWR(hash)
    const token = useAuthToken()
    const router = useRouter()
    return useCallback(() => {
        if (hash && token) {
            const url = `/api/submissions/${encodeURIComponent(hash)}`
            const promise = deleteSubmission(url, token)
            mutate(promise, { optimisticData: undefined as any, rollbackOnError: true })
            promise.then(() => {
                invalidate()
                return router.push("/")
            })
        }
    }, [invalidate, mutate, router, token, hash])
}
export default useSubmissionDeletor
