import { JWT } from "@phylopic/source-models"
import { UUID } from "@phylopic/utils"
import axios from "axios"
import { useRouter } from "next/router"
import { useCallback } from "react"
import useAuthToken from "~/auth/hooks/useAuthToken"
import useImageSWR from "./useImageSWR"
import useListInvalidator from "./useListInvalidator"
const deleteSubmission = async (url: string, token: JWT): Promise<any> => {
    await axios({
        headers: { authorization: `Bearer ${token}` },
        method: "DELETE",
        url,
    })
    return null
}
const useSubmissionDeletor = (uuid: UUID | undefined) => {
    const invalidate = useListInvalidator("/api/submissions")
    const { mutate } = useImageSWR(uuid)
    const token = useAuthToken()
    const router = useRouter()
    return useCallback(() => {
        if (uuid && token) {
            const url = `/api/submissions/${encodeURIComponent(uuid)}`
            const promise = deleteSubmission(url, token)
            mutate(promise, { optimisticData: null as any, rollbackOnError: true })
            promise.then(() => {
                invalidate()
                return router.push("/")
            })
        }
    }, [invalidate, mutate, router, token, uuid])
}
export default useSubmissionDeletor
