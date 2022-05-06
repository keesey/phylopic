import { ImageMediaType } from "@phylopic/utils/dist/models/types"
const getImageFileExtension = (type: ImageMediaType) => type.replace("image/", "").replace("+xml", "")
export default getImageFileExtension
