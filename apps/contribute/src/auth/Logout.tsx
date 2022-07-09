import { Loader } from "@phylopic/ui"
import { FC, ReactNode, useContext, useEffect } from "react"
import AuthContext from "./AuthContext"
export type Props = {
    children?: ReactNode
}
const Logout: FC<Props> = ({ children }) => {
    const [authToken, setAuthToken] = useContext(AuthContext) ?? []
    useEffect(() => {
        setAuthToken?.(null)
        localStorage.clear()
    }, [setAuthToken])
    if (authToken) {
        return <Loader />
    }
    return <>{children}</>
}
export default Logout
