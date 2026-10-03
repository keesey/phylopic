import { phylopicImagePageUrl } from "./phylopicWebUrls.js"
import type { PickedImage } from "./types.js"

type ImageLinks = Readonly<{
    license?: { href?: string }
    vectorFile?: { href?: string }
    sourceFile?: { href?: string }
    specificNode?: { href?: string }
}>

export type ApiImageRecord = Readonly<{
    uuid?: string
    attribution?: string | null
    _links?: ImageLinks
    _embedded?: Readonly<{
        specificNode?: Readonly<{ uuid?: string }>
    }>
}>

export const nodeUuidFromSpecificNodeLink = (image: ApiImageRecord): string | undefined => {
    const embedded = image._embedded?.specificNode?.uuid
    if (embedded) {
        return String(embedded)
    }
    const href = image._links?.specificNode?.href
    if (!href) {
        return undefined
    }
    const match = /\/nodes\/([0-9a-f-]{36})/i.exec(href)
    return match?.[1]
}

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
