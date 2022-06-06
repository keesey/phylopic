import { ImageMediaType } from "@phylopic/utils"
const getImageFileExtension = (type: ImageMediaType) => type.replace("image/", "").replace("+xml", "")
export default getImageFileExtension
