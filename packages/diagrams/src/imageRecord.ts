type ImageLinks = Readonly<{
    license?: { href?: string }
    vectorFile?: { href?: string }
    sourceFile?: { href?: string }
    generalNode?: { href?: string } | null
    specificNode?: { href?: string }
}>

export type ApiImageRecord = Readonly<{
    uuid?: string
    attribution?: string | null
    _links?: ImageLinks
    _embedded?: Readonly<{
        generalNode?: Readonly<{ uuid?: string }> | null
        specificNode?: Readonly<{ uuid?: string }>
    }>
}>

export const nodeUuidFromGeneralNodeLink = (image: ApiImageRecord): string | undefined => {
    const embedded = image._embedded?.generalNode
    if (embedded === null) {
        return undefined
    }
    if (embedded?.uuid) {
        return String(embedded.uuid)
    }
    const href = image._links?.generalNode?.href
    if (!href) {
        return undefined
    }
    const match = /\/nodes\/([0-9a-f-]{36})/i.exec(href)
    return match?.[1]
}

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
