import { JWT } from "@phylopic/source-models"
import { createContext } from "react"
const AuthContext = createContext<Readonly<[JWT | null, (value: JWT | null) => void]> | undefined>(undefined)
export default AuthContext
