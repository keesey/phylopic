import { Contributor, isContributor } from "@phylopic/source-models"
import { useCallback } from "react"
import useAuthToken from "~/auth/hooks/useAuthToken"
import useAuthorizedRequest from "~/auth/hooks/useAuthorizedRequest"
import useContributorSWR from "./useContributorSWR"
import useContributorUUID from "./useContributorUUID"
const useContributorMutator = () => {
    const { data, mutate } = useContributorSWR()
    const request = useAuthorizedRequest()
    const token = useAuthToken()
    const uuid = useContributorUUID()
    return useCallback(
        (newValue: Partial<Contributor>) => {
            if (uuid && token) {
                const url = `/api/contributors/${encodeURIComponent(uuid)}`
                if (isContributor(newValue)) {
                    mutate(
                        request({ data: newValue, method: "PUT", url }).then(() => newValue),
                        {
                            optimisticData: newValue,
                            rollbackOnError: true,
                        },
                    )
                } else if (data) {
                    const newData = { ...data, ...newValue }
                    mutate(
                        request({ data: newValue, method: "PATCH", url }).then(() => newData),
                        {
                            optimisticData: newData,
                            rollbackOnError: true,
                        },
                    )
                }
            }
        },
        [data, mutate, request, token, uuid],
    )
}
export default useContributorMutator
