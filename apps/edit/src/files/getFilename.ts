import { Image } from "@phylopic/source-models"
import { getImageFileExtension, ImageMediaType, SHORT_LICENSE_NAMES, UUID } from "@phylopic/utils"
const getFilename = (image: Image & { uuid: UUID }, contentType: ImageMediaType) => {
    return [
        image.uuid,
        image.attribution || "Anonymous",
        image.license ? SHORT_LICENSE_NAMES[image.license] : "unlicensed",
        getImageFileExtension(contentType),
    ]
        .map(x => encodeURIComponent(x))
        .join(".")
}
export default getFilename
