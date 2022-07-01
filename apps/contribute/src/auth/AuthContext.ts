import { createContext } from "react"
import { JWT } from "./models/JWT"
const AuthContext = createContext<Readonly<[JWT | null, (value: JWT | null) => void]> | undefined>(undefined)
export default AuthContext
