import { useEffect } from "react"
import useExpiration from "./useExpiration"
const useExpirationHandler = (onExpire?: () => void, bufferMS = 0) => {
    const expiration = useExpiration()
    useEffect(() => {
        if (typeof expiration === "number" && onExpire) {
            const now = new Date().valueOf() - bufferMS
            if (expiration <= now) {
                onExpire()
            } else {
                const handle = setTimeout(onExpire, expiration - now)
                return () => clearTimeout(handle)
            }
        }
    }, [bufferMS, expiration, onExpire])
}
export default useExpirationHandler
