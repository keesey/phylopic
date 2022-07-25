import { ImageMediaType } from "@phylopic/utils"

export type ReviewResult = Readonly<{
    buffer: Buffer
    source: string
    type: ImageMediaType
}>
