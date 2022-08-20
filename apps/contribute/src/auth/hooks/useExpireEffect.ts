import { useRouter } from "next/router"
import { useCallback } from "react"
import useExpirationHandler from "./useExpirationHandler"
const useExpireEffect = (bufferMS = 0) => {
    const router = useRouter()
    const handleExpire = useCallback(async () => {
        alert("Your session has timed out due to inactivity. You'll have to enter your email to re-authorize.")
        if (router.pathname !== "/") {
            await router.push("/")
        }
    }, [router])
    useExpirationHandler(handleExpire, bufferMS)
}
export default useExpireEffect
