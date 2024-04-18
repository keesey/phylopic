import type { Image } from "@phylopic/api-models"
import type { CladesGameImage } from "./CladesGame"
export const trimImage = (image: Image | CladesGameImage): CladesGameImage => {
    return {
        _links: {
            license: image._links.license,
            rasterFiles: image._links.rasterFiles,
            self: image._links.self,
            thumbnailFiles: image._links.thumbnailFiles,
            vectorFile: image._links.vectorFile,
        },
        attribution: image.attribution,
        modifiedFile: image.modifiedFile,
        uuid: image.uuid,
    }
}
