import type { ImageWithEmbedded, List } from "@phylopic/api-models"
import {
    buildCollectionCladogramTree,
    phylopicCollectionPageUrl,
    renderCollectionCladogramSvg,
} from "@phylopic/diagrams"
import { createSearch } from "@phylopic/utils"
import BUILD from "~/build/BUILD"

const IMAGE_QUERY = {
    build: BUILD,
    embed_items: "true",
    embed_specificNode: "true",
} as const

export const loadAllCollectionImages = async (apiBaseUrl: string, collectionUuid: string): Promise<ImageWithEmbedded[]> => {
    const items: ImageWithEmbedded[] = []
    let page = 0
    while (page < 256) {
        const url = `${apiBaseUrl.replace(/\/$/, "")}/images${createSearch({
            filter_collection: collectionUuid,
            ...IMAGE_QUERY,
            page,
        })}`
        const res = await fetch(url)
        if (!res.ok) {
            throw new Error(`Failed to load collection images (${res.status}).`)
        }
        const list = (await res.json()) as List & { _embedded?: { items?: ImageWithEmbedded[] } }
        const batch = list._embedded?.items ?? []
        if (!batch.length) {
            break
        }
        items.push(...batch)
        page += 1
        if (!list._links?.next) {
            break
        }
    }
    return items
}

export const downloadCollectionCladogramSvg = async (collectionUuid: string): Promise<void> => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const wwwOrigin = process.env.NEXT_PUBLIC_WWW_URL ?? "https://www.phylopic.org"
    if (!apiBaseUrl) {
        throw new Error("API URL is not configured.")
    }
    const images = await loadAllCollectionImages(apiBaseUrl, collectionUuid)
    if (images.length < 2) {
        throw new Error("Add at least two silhouette images with specific taxa to generate a cladogram.")
    }
    const fetchLineagePage = async (nodeUuid: string, page: number) => {
        const url = `${apiBaseUrl.replace(/\/$/, "")}/nodes/${nodeUuid}/lineage${createSearch({
            build: BUILD,
            embed_items: "true",
            page,
        })}`
        const res = await fetch(url)
        if (!res.ok) {
            throw new Error(`Failed to load lineage for node ${nodeUuid}.`)
        }
        return res.json()
    }
    const built = await buildCollectionCladogramTree(images, fetchLineagePage)
    const imagesByUuid = new Map(images.map(image => [String(image.uuid), image]))
    const svg = await renderCollectionCladogramSvg({
        built,
        imagesByUuid,
        wwwOrigin,
        collectionPageUrl: phylopicCollectionPageUrl(wwwOrigin, collectionUuid),
        diagramTitle: "Collection cladogram",
    })
    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" })
    const objectUrl = URL.createObjectURL(blob)
    const anchor = document.createElement("a")
    anchor.href = objectUrl
    anchor.download = `phylopic-collection-${collectionUuid}-cladogram.svg`
    anchor.click()
    URL.revokeObjectURL(objectUrl)
}
