import type { ImageMediaType } from "@phylopic/utils"

export interface ImageFile {
    data: Buffer
    type: ImageMediaType
}
