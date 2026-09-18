import { decodeJWT } from "@phylopic/source-models"
import type { JwtPayload } from "jsonwebtoken"
import { useMemo } from "react"
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
