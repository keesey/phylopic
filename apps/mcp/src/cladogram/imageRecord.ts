import type { ApiImageRecord } from "@phylopic/diagrams"
import { phylopicImagePageUrl } from "./phylopicWebUrls.js"
import type { PickedImage } from "./types.js"

export const toPickedImage = (image: ApiImageRecord): PickedImage | null => {
    const uuid = image.uuid
    if (!uuid) {
        return null
    }
    return {
        attribution: image.attribution ?? null,
        license: image._links?.license?.href,
        pageUrl: phylopicImagePageUrl(uuid),
        sourceUrl: image._links?.sourceFile?.href,
        uuid,
        vectorUrl: image._links?.vectorFile?.href,
    }
}
