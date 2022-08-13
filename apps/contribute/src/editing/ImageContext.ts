import { UUID } from "@phylopic/utils"
import { createContext } from "react"
const ImageContext = createContext<UUID | undefined>(undefined)
export default ImageContext
