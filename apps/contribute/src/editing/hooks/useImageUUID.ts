import { UUID } from "@phylopic/utils"
import { useContext } from "react"
import ImageContext from "../ImageContext"
const useImageUUID = (): UUID | undefined => useContext(ImageContext)
export default useImageUUID
