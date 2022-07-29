import { useCallback, useState } from "react"
import useExpirationHandler from "./useExpirationHandler"
const useExpired = (bufferMS = 0) => {
    const [expired, setExpired] = useState(false)
    const handler = useCallback(() => {
        setExpired(true)
    }, [])
    useExpirationHandler(handler, bufferMS)
    return expired
}
export default useExpired
