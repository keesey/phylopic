import { JWT } from "@phylopic/source-models"
import { UUID } from "@phylopic/utils"
import axios from "axios"
import { useRouter } from "next/router"
import { useCallback } from "react"
import useAuthToken from "~/auth/hooks/useAuthToken"
import useImageSWR from "./useImageSWR"
const deleteImage = async (url: string, token: JWT): Promise<any> => {
    await axios({
        headers: { authorization: `Bearer ${token}` },
        method: "DELETE",
        url,
    })
    return null
}
const useImageDeletor = (uuid: UUID | undefined) => {
    const { mutate } = useImageSWR(uuid)
    const token = useAuthToken()
    const router = useRouter()
    return useCallback(() => {
        if (uuid && token) {
            const url = `/api/images/${encodeURIComponent(uuid)}`
            const promise = deleteImage(url, token)
            mutate(promise, { optimisticData: null as any, rollbackOnError: true })
            promise.then(() => router.push("/"))
        }
    }, [mutate, router, token, uuid])
}
export default useImageDeletor
