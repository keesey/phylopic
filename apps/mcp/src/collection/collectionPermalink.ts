import type { ImageWithEmbedded } from "@phylopic/api-models"
import { isHash, type Hash } from "@phylopic/utils"
import { phylopicPermalinkPageUrl } from "../cladogram/phylopicWebUrls.js"

export type CollectionPermalinkSnapshot = Readonly<{
    type: "collection"
    uuid: string
    entities: Readonly<{
        images: readonly ImageWithEmbedded[]
    }>
}>

export const parsePermalinkHash = (permalinkUrlOrHash: string): Hash => {
    const trimmed = permalinkUrlOrHash.trim()
    const fromUrl = /\/permalinks\/([0-9a-f]{64})\/?$/i.exec(trimmed)?.[1]
    const candidate = (fromUrl ?? trimmed).toLowerCase()
    if (!isHash(candidate)) {
        throw new Error("Expected a PhyloPic permalink URL or 64-character hex hash.")
    }
    return candidate
}

export const permalinkUrlFromHash = (hash: Hash) => phylopicPermalinkPageUrl(hash)

const isCollectionPermalinkSnapshot = (value: unknown): value is CollectionPermalinkSnapshot => {
    if (!value || typeof value !== "object") {
        return false
    }
    const data = value as CollectionPermalinkSnapshot
    return (
        data.type === "collection" &&
        typeof data.uuid === "string" &&
        Array.isArray(data.entities?.images) &&
        data.entities.images.length > 0
    )
}

/** Load frozen collection entities from a public www permalink page (`__NEXT_DATA__`). */
export const fetchPermalinkCollectionSnapshot = async (
    permalinkUrlOrHash: string,
    fetchFn: typeof fetch = fetch,
): Promise<CollectionPermalinkSnapshot> => {
    const hash = parsePermalinkHash(permalinkUrlOrHash)
    const pageUrl = phylopicPermalinkPageUrl(hash)
    const response = await fetchFn(pageUrl, { headers: { accept: "text/html" } })
    if (!response.ok) {
        throw new Error(`Could not load permalink page (${response.status}).`)
    }
    const html = await response.text()
    const match = /<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/i.exec(html)
    if (!match?.[1]) {
        throw new Error("Permalink page did not include collection data.")
    }
    const nextData = JSON.parse(match[1]) as { props?: { pageProps?: { data?: unknown } } }
    const data = nextData.props?.pageProps?.data
    if (!isCollectionPermalinkSnapshot(data)) {
        throw new Error("Permalink is not a collection snapshot with images.")
    }
    return data
}
