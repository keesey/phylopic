import { UUID } from "@phylopic/utils"
import { useRouter } from "next/router"
import { useCallback, useState } from "react"
import useAuthorizedJSONFetcher from "~/auth/hooks/useAuthorizedJSONFetcher"
const useImageSpawn = () => {
    const [pending, setPending] = useState(false)
    const [error, setError] = useState<any>()
    const fetcher = useAuthorizedJSONFetcher<{ uuid: UUID }>()
    const router = useRouter()
    const spawn = useCallback(async () => {
        setPending(true)
        setError(false)
        try {
            const result = await fetcher({ method: "POST", url: "/api/spawn" })
            await router.push(`/edit/${encodeURIComponent(result.uuid)}/file`)
        } catch (e) {
            setError(e)
        } finally {
            setPending(false)
        }
    }, [fetcher, router])
    return [spawn, error, pending] as Readonly<[() => void, any, boolean]>
}
export default useImageSpawn
