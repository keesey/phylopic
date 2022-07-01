import { useContext } from "react"
import AuthContext from "../AuthContext"
const useAuthToken = () => {
    const [token] = useContext(AuthContext) ?? []
    return token || null
}
export default useAuthToken
