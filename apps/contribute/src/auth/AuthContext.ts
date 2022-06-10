import { createContext } from "react"
import { JWT } from "./JWT"
const AuthContext = createContext<Readonly<[JWT | null, (value: JWT | null) => void]> | undefined>(undefined)
export default AuthContext
