import { useContext, useMemo } from "react"
import AuthContext from "../AuthContext"
import decodeJWT from "../jwt/decodeJWT"
const usePayload = () => {
    const [token] = useContext(AuthContext) ?? []
    return useMemo(() => {
        if (!token) {
            return null
        }
        return decodeJWT(token)
    }, [token])
}
export default usePayload
