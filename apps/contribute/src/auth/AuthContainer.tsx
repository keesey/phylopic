import { useStoredState } from "@phylopic/client-components"
import type { JWT } from "@phylopic/source-models"
import type { FC, ReactNode } from "react"
import AuthContext from "./AuthContext"
type Props = {
    children: ReactNode
}
const AuthContainer: FC<Props> = ({ children }) => {
    const contextValue = useStoredState<JWT>("auth")
    return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}
export default AuthContainer
