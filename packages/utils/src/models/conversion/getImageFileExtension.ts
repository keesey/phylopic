import { ImageMediaType } from "../types"
export const getImageFileExtension = (type: ImageMediaType) => type.replace("image/", "").replace("+xml", "")
export default getImageFileExtension
