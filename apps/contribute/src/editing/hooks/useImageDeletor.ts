import { Image, JWT } from "@phylopic/source-models"
import { UUID } from "@phylopic/utils"
import axios from "axios"
import { useRouter } from "next/router"
import { useCallback } from "react"
import useAuthToken from "~/auth/hooks/useAuthToken"
import decodeJWT from "~/auth/jwt/decodeJWT"
import useImageSWR from "./useImageSWR"
const deleteImage = async (key: string, token: JWT, result: Image): Promise<Image> => {
    await axios.delete(key, {
        headers: { authorization: `Bearer ${token}` },
    })
    return result
}
const useImageDeletor = (uuid: UUID | undefined) => {
    const { mutate } = useImageSWR(uuid)
    const token = useAuthToken()
    const router = useRouter()
    return useCallback(() => {
        if (uuid && token) {
            const key = `/api/images/${encodeURIComponent(uuid)}`
            const now = new Date().toISOString()
            const { sub } = decodeJWT(token) ?? {}
            const result: Image = {
                accepted: false,
                attribution: null,
                contributor: sub!,
                created: now,
                general: null,
                license: null,
                modified: now,
                specific: null,
                sponsor: null,
                submitted: false,
            }
            const promise = deleteImage(key, token, result)
            mutate(promise, { optimisticData: result, rollbackOnError: true })
            promise.then(() => router.push("/"))
        }
    }, [mutate, router, token, uuid])
}
export default useImageDeletor
