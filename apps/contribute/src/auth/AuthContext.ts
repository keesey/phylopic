import { createContext } from "react"
import { JWT } from "./JWT"
const AuthContext = createContext<Readonly<[JWT | undefined, (value: JWT | undefined) => void]> | undefined>(undefined)
export default AuthContext
