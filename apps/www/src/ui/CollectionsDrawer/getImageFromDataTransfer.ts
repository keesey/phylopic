import { DATA_MEDIA_TYPE, isImage } from "@phylopic/api-models"
const getImageFromDataTransfer = (dataTransfer: DataTransfer) => {
    const json = dataTransfer.getData(DATA_MEDIA_TYPE)
    if (!json) {
        return null
    }
    try {
        const image = JSON.parse(json)
        if (isImage(image)) {
            return image
        }
    } catch {
        // Ignore bad JSON.
    }
    return null
}
export default getImageFromDataTransfer
