import { UUID } from "@phylopic/utils"
import axios from "axios"
import { useCallback } from "react"
import useAuthToken from "~/auth/hooks/useAuthToken"
import useSubmissionSWR from "./useSubmissionSWR"
const useSubmissionDeleter = (uuid: UUID, onComplete?: () => void) => {
    const token = useAuthToken()
    const { mutate } = useSubmissionSWR(uuid)
    return useCallback(() => {
        mutate(
            async () => {
                await axios.delete(`/api/submissions/${encodeURIComponent(uuid)}`, {
                    headers: {
                        authorization: `Bearer ${token}`,
                    },
                })
                try {
                    onComplete?.()
                } finally {
                    return undefined
                }
            },
            { optimisticData: undefined },
        )
    }, [mutate, token])
}
export default useSubmissionDeleter
