import type { ImageWithEmbedded } from "@phylopic/api-models"
import type { GameImage } from "../models"
export const trimImage = (image: ImageWithEmbedded | GameImage): GameImage => {
    return {
        _embedded: {
            specificNode: image._embedded.specificNode,
        },
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
