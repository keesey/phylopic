import { useState } from "react"
import useExpirationHandler from "./useExpirationHandler"
const useExpired = (bufferMS = 0) => {
    const [expired, setExpired] = useState(false)
    useExpirationHandler(() => setExpired(true), bufferMS)
    return expired
}
export default useExpired
