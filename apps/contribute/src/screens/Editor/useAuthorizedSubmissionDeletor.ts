import { Hash } from "@phylopic/utils"
import axios from "axios"
import { useCallback, useState } from "react"
import useAuthToken from "~/auth/hooks/useAuthToken"
const useAuthorizedSubmissionDeletor = (hash: Hash) => {
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
                await axios.delete(`/api/submissions/${encodeURIComponent(hash)}`, {
                    headers: { authorization: `Bearer ${authToken}` },
                })
                setIsDeleted(true)
            } catch (e) {
                setError(e instanceof Error ? e : new Error(String(e)))
            } finally {
                setIsLoading(false)
            }
        })()
    }, [authToken, hash])
    return { error, isDeleted, isLoading, mutate }
}
export default useAuthorizedSubmissionDeletor
