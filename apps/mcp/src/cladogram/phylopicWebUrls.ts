/** Canonical public site (see SUBDOMAINS.md). Slug URLs are optional; UUID paths resolve. */
export const PHYLOPIC_WWW_ORIGIN = "https://www.phylopic.org"

export const phylopicNodePageUrl = (nodeUuid: string) =>
    `${PHYLOPIC_WWW_ORIGIN}/nodes/${encodeURIComponent(nodeUuid)}`

export const phylopicImagePageUrl = (imageUuid: string) =>
    `${PHYLOPIC_WWW_ORIGIN}/images/${encodeURIComponent(imageUuid)}`
