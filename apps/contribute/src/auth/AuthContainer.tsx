import { FC, ReactNode } from "react"
import useStoredState from "~/persist/useStoredState"
import AuthContext from "./AuthContext"
import useExpireEffect from "./hooks/useExpireEffect"
import { JWT } from "./JWT"
type Props = {
    children: ReactNode
}
const AuthContainer: FC<Props> = ({ children }) => {
    const contextValue = useStoredState<JWT>("auth")
    useExpireEffect(contextValue[0])
    return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}
export default AuthContainer
