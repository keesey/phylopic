import { useCallback, useState } from "react"
import isJWTExpired from "../jwt/isJWTExpired"
import useAuthToken from "./useAuthToken"
import useExpirationHandler from "./useExpirationHandler"
const useAuthorized = () => {
    const token = useAuthToken()
    const [expired, setExpired] = useState(() => isJWTExpired(token))
    const handleExpire = useCallback(() => setExpired(true), [])
    useExpirationHandler(handleExpire)
    return Boolean(token) && !expired
}
export default useAuthorized
