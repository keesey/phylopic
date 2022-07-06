import { useStoredState } from "@phylopic/ui"
import { FC, ReactNode } from "react"
import AuthContext from "./AuthContext"
import { JWT } from "./models/JWT"
type Props = {
    children: ReactNode
}
const AuthContainer: FC<Props> = ({ children }) => {
    const contextValue = useStoredState<JWT>("auth")
    return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}
export default AuthContainer
