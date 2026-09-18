import type { Image } from "@phylopic/source-models"
import { getImageFileExtension, type ImageMediaType, SHORT_LICENSE_NAMES, type UUID } from "@phylopic/utils"

const getImageFilename = (image: Image & { uuid: UUID }, contentType: ImageMediaType) => {
    return [
        image.uuid,
        image.attribution || "Anonymous",
        image.license ? SHORT_LICENSE_NAMES[image.license] : "unlicensed",
        getImageFileExtension(contentType),
    ]
        .map(x => encodeURIComponent(x))
        .join(".")
}

export default getImageFilename
