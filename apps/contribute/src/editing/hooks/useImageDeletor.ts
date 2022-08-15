import { JWT } from "@phylopic/source-models"
import { UUID } from "@phylopic/utils"
import axios from "axios"
import { useRouter } from "next/router"
import { useCallback } from "react"
import useAuthToken from "~/auth/hooks/useAuthToken"
import useImageSWR from "./useImageSWR"
const deleteImage = async (key: string, token: JWT): Promise<any> => {
    await axios.delete(key, {
        headers: { authorization: `Bearer ${token}` },
    })
}
const useImageDeletor = (uuid: UUID | undefined) => {
    const { mutate } = useImageSWR(uuid)
    const token = useAuthToken()
    const router = useRouter()
    return useCallback(() => {
        if (uuid && token) {
            const key = `/api/images/${encodeURIComponent(uuid)}`
            const promise = deleteImage(key, token)
            mutate(promise, { optimisticData: undefined, rollbackOnError: true })
            promise.then(() => router.push("/"))
        }
    }, [mutate, router, token, uuid])
}
export default useImageDeletor
