import { ImageMediaType, isImageMediaType } from "@phylopic/utils"
const getImageMediaTypeFromFileName = (filename: string | undefined): ImageMediaType => {
    if (!filename) {
        return "image/png"
    }
    const extension = filename.slice(filename.lastIndexOf(".") + 1)
    if (extension === "svg") {
        return "image/svg+xml"
    }
    const type = `image/${extension}`
    return isImageMediaType(type) ? type : "image/png"
}
export default getImageMediaTypeFromFileName
