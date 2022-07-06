import { useCallback, useEffect, useMemo, useState } from "react"
import isJWTExpired from "../jwt/isJWTExpired"
import useAuthToken from "./useAuthToken"
import useExpirationHandler from "./useExpirationHandler"
const useAuthorized = () => {
    const token = useAuthToken()
    const [now, setNow] = useState(() => new Date().valueOf())
    const expired = useMemo(() => isJWTExpired(token, now), [now, token])
    const handleExpire = useCallback(() => setNow(new Date().valueOf()), [])
    useExpirationHandler(handleExpire)
    return Boolean(token) && !expired
}
export default useAuthorized
