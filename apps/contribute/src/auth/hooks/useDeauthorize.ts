import { useRouter } from "next/router"
import { useCallback, useContext } from "react"
import AuthContext from "../AuthContext"
const MESSAGE = "Your authorization is no longer valid. You'll have to enter your email address to sign in again."
const useDeauthorize = () => {
    const [, setToken] = useContext(AuthContext) ?? []
    const router = useRouter()
    return useCallback(async () => {
        setToken?.(null)
        alert(MESSAGE)
        if (router.pathname !== "/") {
            await router.push("/")
        }
    }, [router, setToken])
}
export default useDeauthorize
