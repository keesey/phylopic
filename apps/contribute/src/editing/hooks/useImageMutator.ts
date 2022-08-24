import { Image, isImage, isSubmittableImage, JWT } from "@phylopic/source-models"
import { UUID } from "@phylopic/utils"
import axios from "axios"
import { useCallback } from "react"
import useAuthToken from "~/auth/hooks/useAuthToken"
import useImagesInvalidator from "./useImagesInvalidator"
import useImageSWR from "./useImageSWR"
const put = async (key: string, token: JWT, newValue: Image & { uuid: UUID }) => {
    await axios.put(key, newValue, {
        headers: { authorization: `Bearer ${token}` },
    })
    return newValue
}
const patch = async (key: string, token: JWT, newValue: Partial<Image>, newData: Image & { uuid: UUID }) => {
    await axios.patch(key, newValue, {
        headers: { authorization: `Bearer ${token}` },
    })
    return newData
}
const useImageMutator = (uuid: UUID | undefined) => {
    const invalidate = useImagesInvalidator()
    const { data, mutate } = useImageSWR(uuid)
    const token = useAuthToken()
    return useCallback(
        (newValue: Partial<Image>) => {
            if (uuid && token) {
                const key = `/api/images/${encodeURIComponent(uuid)}`
                let promise: Promise<Image & { uuid: UUID }> | undefined
                if (isSubmittableImage(newValue)) {
                    promise = put(key, token, {...newValue, uuid})
                    mutate(promise, { optimisticData: {...newValue, uuid}, rollbackOnError: true })
                } else if (isImage(newValue) && !newValue.submitted) {
                    promise = put(key, token, {...newValue, uuid})
                    mutate(promise, { optimisticData: {...newValue, uuid}, rollbackOnError: true })
                } else if (data) {
                    const newData = { ...data, ...newValue, uuid }
                    promise = patch(key, token, newValue, newData)
                    mutate(promise, {
                        optimisticData: newData,
                        rollbackOnError: true,
                    })
                }
                promise?.then(() => invalidate())
            }
        },
        [data, invalidate, mutate, token, uuid],
    )
}
export default useImageMutator
