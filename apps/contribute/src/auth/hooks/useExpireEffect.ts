import { useRouter } from "next/router"
import { useCallback, useEffect, useMemo } from "react"
import { JWT } from "../JWT"
import decodeJWT from "../jwt/decodeJWT"
const useExpireEffect = (token: JWT | null) => {
    const router = useRouter()
    const expiration = useMemo(() => {
        if (token) {
            const decoded = decodeJWT(token)
            if (typeof decoded?.exp === "number") {
                return decoded.exp * 1000
            }
        }
    }, [token])
    const expire = useCallback(async () => {
        if (router.pathname !== "/") {
            alert("Your session has timed out due to inactivity. You'll have to enter your email to re-authorize.")
            await router.push("/")
        }
    }, [router])
    useEffect(() => {
        if (typeof expiration === "number") {
            const now = new Date().valueOf()
            if (expiration <= now) {
                expire()
            } else {
                const handle = setTimeout(expire, expiration - now)
                return () => clearTimeout(handle)
            }
        }
    }, [expire, expiration, router])
}
export default useExpireEffect
