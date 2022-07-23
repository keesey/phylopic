import { useCallback, useState } from "react"
import useExpirationHandler from "./useExpirationHandler"
const useExpired = (bufferMS = 0) => {
    const [expired, setExpired] = useState(false)
    const handler = useCallback(() => {
        console.log("useExpirationHandler", "handler called")
        setExpired(true)
    }, [])
    useExpirationHandler(handler, bufferMS)
    return expired
}
export default useExpired
