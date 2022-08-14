import { Image, isImage, isSubmittableImage, JWT } from "@phylopic/source-models"
import { UUID } from "@phylopic/utils"
import axios from "axios"
import { useCallback } from "react"
import useAuthToken from "~/auth/hooks/useAuthToken"
import useImageSWR from "./useImageSWR"
const put = async (key: string, token: JWT, newValue: Image) => {
    await axios.put(key, newValue, {
        headers: { authorization: `Bearer ${token}` },
    })
    return newValue
}
const patch = async (key: string, token: JWT, newValue: Partial<Image>, newData: Image) => {
    await axios.patch(key, newValue, {
        headers: { authorization: `Bearer ${token}` },
    })
    return newData
}
const useImageMutator = (uuid: UUID | undefined) => {
    const { data, mutate } = useImageSWR(uuid)
    const token = useAuthToken()
    return useCallback(
        (newValue: Partial<Image>) => {
            if (uuid && token) {
                const key = `/api/images/${encodeURIComponent(uuid)}`
                if (isSubmittableImage(newValue)) {
                    mutate(put(key, token, newValue), { optimisticData: newValue, rollbackOnError: true })
                } else if (isImage(newValue) && !newValue.submitted) {
                    mutate(put(key, token, newValue), { optimisticData: newValue, rollbackOnError: true })
                } else if (data) {
                    const newData = { ...data, ...newValue }
                    mutate(patch(key, token, newValue, newData), {
                        optimisticData: newData,
                        rollbackOnError: true,
                    })
                }
            }
        },
        [data, mutate, token, uuid],
    )
}
export default useImageMutator
