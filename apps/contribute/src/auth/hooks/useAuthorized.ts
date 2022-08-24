import { useCallback, useEffect, useMemo, useState } from "react"
import isJWTExpired from "../jwt/isJWTExpired"
import useAuthToken from "./useAuthToken"
import useExpirationHandler from "./useExpirationHandler"
const useAuthorized = () => {
    const [mounted, setMounted] = useState(false)
    useEffect(() => setMounted(true), [])
    const token = useAuthToken()
    const [now, setNow] = useState(() => new Date().valueOf())
    const expired = useMemo(() => isJWTExpired(token, now), [now, token])
    const handleExpire = useCallback(() => setNow(new Date().valueOf()), [])
    useExpirationHandler(handleExpire)
    return mounted && Boolean(token) && !expired
}
export default useAuthorized
