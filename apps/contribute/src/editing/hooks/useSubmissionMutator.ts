import { JWT, Submission } from "@phylopic/source-models"
import { UUID } from "@phylopic/utils"
import axios from "axios"
import { useCallback } from "react"
import useAuthToken from "~/auth/hooks/useAuthToken"
import useListInvalidator from "./useListInvalidator"
import useSubmissionSWR from "./useSubmissionSWR"
const patch = async (key: string, token: JWT, newValue: Partial<Submission>, newData: Submission & { uuid: UUID }) => {
    await axios.patch(key, newValue, {
        headers: { authorization: `Bearer ${token}` },
    })
    return newData
}
const useSubmissionMutator = (uuid: UUID | undefined) => {
    const invalidate = useListInvalidator("/api/submissions")
    const { data, mutate } = useSubmissionSWR(uuid)
    const token = useAuthToken()
    return useCallback(
        (newValue: Partial<Submission>) => {
            if (data && uuid && token) {
                const key = `/api/submissions/${encodeURIComponent(uuid)}`
                let promise: Promise<Submission & { uuid: UUID }> | undefined
                const newData = { ...data, ...newValue, uuid } as Submission & { uuid: UUID }
                promise = patch(key, token, newValue, newData)
                mutate(promise, {
                    optimisticData: newData,
                    revalidate: true,
                    rollbackOnError: true,
                })
                promise?.then(() => invalidate())
            }
        },
        [data, invalidate, mutate, token, uuid],
    )
}
export default useSubmissionMutator
