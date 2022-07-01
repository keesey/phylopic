import { useStoredState } from "@phylopic/ui"
import { FC, ReactNode } from "react"
import AuthContext from "./AuthContext"
import useExpireEffect from "./hooks/useExpireEffect"
import { JWT } from "./models/JWT"
type Props = {
    children: ReactNode
}
const Expire: FC = () => {
    useExpireEffect(1000)
    return null
}
const AuthContainer: FC<Props> = ({ children }) => {
    const contextValue = useStoredState<JWT>("auth")
    return (
        <AuthContext.Provider value={contextValue}>
            <Expire />
            {children}
        </AuthContext.Provider>
    )
}
export default AuthContainer
