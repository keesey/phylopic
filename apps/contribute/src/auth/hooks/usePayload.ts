import { JwtPayload } from "jsonwebtoken"
import { useMemo } from "react"
import decodeJWT from "../jwt/decodeJWT"
import useAuthToken from "./useAuthToken"
const usePayload = () => {
    const token = useAuthToken()
    return useMemo<JwtPayload | null>(() => {
        if (!token) {
            return null
        }
        return decodeJWT(token)
    }, [token])
}
export default usePayload
