import { JwtPayload } from "jsonwebtoken"
import { useMemo } from "react"
import decodeJWT from "../jwt/decodeJWT"
import Payload from "../models/Payload"
import useAuthToken from "./useAuthToken"
const usePayload = () => {
    const token = useAuthToken()
    return useMemo<(JwtPayload & Payload) | null>(() => {
        if (!token) {
            return null
        }
        return decodeJWT(token)
    }, [token])
}
export default usePayload
