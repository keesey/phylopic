import { UUID } from "@phylopic/utils"
import useImageSWR from "./useImageSWR"
const useImage = (uuid: UUID | undefined) => {
    const { data } = useImageSWR(uuid)
    return data
}
export default useImage
