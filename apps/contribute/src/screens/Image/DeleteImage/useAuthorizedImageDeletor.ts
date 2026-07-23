import { UUID } from "@phylopic/utils"
import { useCallback, useState } from "react"
import useAuthToken from "~/auth/hooks/useAuthToken"
import axios from "axios"
const useAuthorizedImageDeletor = (uuid: UUID) => {
    const authToken = useAuthToken()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<Error | undefined>()
    const [isDeleted, setIsDeleted] = useState(false)
    const mutate = useCallback(() => {
        setIsLoading(false)
        setError(undefined)
        setIsDeleted(false)
        ;(async () => {
            try {
                await axios.delete(`/api/images/${encodeURIComponent(uuid)}`, {
                    headers: { authorization: `Bearer ${authToken}` },
                })
                setIsDeleted(true)
            } catch (e) {
                setError(e instanceof Error ? e : new Error(String(e)))
            } finally {
                setIsLoading(false)
            }
        })()
    }, [authToken, uuid])
    return { error, isDeleted, isLoading, mutate }
}
export default useAuthorizedImageDeletor
