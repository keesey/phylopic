import { UUID } from "@phylopic/utils"
import useImageSrcSWR from "./useImageSrcSWR"
const useImageSrc = (uuid?: UUID) => {
    const { data } = useImageSrcSWR(uuid)
    return data
}
export default useImageSrc
