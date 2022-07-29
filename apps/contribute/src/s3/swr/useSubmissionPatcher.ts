import { UUID } from "@phylopic/utils"
import axios from "axios"
import { useCallback } from "react"
import useAuthToken from "~/auth/hooks/useAuthToken"
import { Submission } from "~/submission/Submission"
import useSubmissionSWR from "./useSubmissionSWR"
const useSubmissionPatcher = (uuid: UUID, onComplete?: () => void) => {
    const token = useAuthToken()
    const { data: submission, mutate } = useSubmissionSWR(uuid)
    return useCallback(
        (patch: Partial<Submission>) => {
            mutate(
                async () => {
                    const result = { ...submission, ...patch }
                    await axios.patch(`/api/submissions/${encodeURIComponent(uuid)}`, patch, {
                        headers: {
                            authorization: `Bearer ${token}`,
                        },
                    })
                    try {
                        onComplete?.()
                    } finally {
                        return result
                    }
                },
                { revalidate: true },
            )
        },
        [mutate, submission, token],
    )
}
export default useSubmissionPatcher
