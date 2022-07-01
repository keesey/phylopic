import { ImageMediaType } from "@phylopic/utils"
import { ImageFileExtension } from "~/s3/ImageFileExtension"
const getImageFileExtension = (type: ImageMediaType) =>
    type.replace("image/", "").replace("+xml", "") as ImageFileExtension
export default getImageFileExtension
