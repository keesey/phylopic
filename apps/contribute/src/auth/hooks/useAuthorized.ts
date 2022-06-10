import { useContext, useEffect, useMemo, useState } from "react"
import AuthContext from "../AuthContext"
import decodeJWT from "../jwt/decodeJWT"
const getCurrentTimeInSeconds = () => Math.floor(new Date().valueOf() / 1000)
const useAuthorized = () => {
    const [token] = useContext(AuthContext) ?? []
    const [time, setTime] = useState(NaN)
    const hasToken = Boolean(token)
    useEffect(() => {
        if (hasToken) {
            setTime(getCurrentTimeInSeconds())
            const handle = setTimeout(() => setTime(getCurrentTimeInSeconds()))
            return () => clearTimeout(handle)
        } else {
            setTime(NaN)
        }
    }, [hasToken])
    const expiration = useMemo(() => {
        if (!token) {
            return NaN
        }
        const decoded = decodeJWT(token)
        return decoded?.exp ?? NaN
    }, [token])
    return useMemo(() => {
        if (isNaN(expiration) || isNaN(time)) {
            return false
        }
        return expiration > time
    }, [expiration, time])
}
export default useAuthorized
