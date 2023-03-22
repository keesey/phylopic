import { UUID } from "@phylopic/utils"
import { useCallback, useState } from "react"
import useAuthToken from "~/auth/hooks/useAuthToken"
import axios from "axios"
const useAuthorizedImageDeletor = (uuid: UUID) => {
    const authToken = useAuthToken()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<Error | undefined>()
    const [deleted, setDeleted] = useState(false)
    const mutate = useCallback(() => {
        setIsLoading(false)
        setError(undefined)
        setDeleted(false)
        ;(async () => {
            try {
                axios.delete(`/api/images/${encodeURIComponent(uuid)}`, {
                    headers: { authorization: `Bearer ${authToken}` },
                })
                setDeleted(true)
            } catch (e) {
                setError(e instanceof Error ? e : new Error(String(e)))
            } finally {
                setIsLoading(false)
            }
        })()
    }, [authToken, uuid])
    return { deleted, error, isLoading, mutate }
}
export default useAuthorizedImageDeletor
