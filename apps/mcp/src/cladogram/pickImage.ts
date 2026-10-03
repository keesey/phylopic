import type { PhyloPicClient } from "../client/PhyloPicClient.js"
import { nodeUuidFromSpecificNodeLink, toPickedImage, type ApiImageRecord } from "./imageRecord.js"
import { imageMatchesLicenseFilters } from "./licenseFilters.js"
import { phylopicNodePageUrl } from "./phylopicWebUrls.js"
import type { PickImageOptions, PickImageResult } from "./types.js"

const withPageUrls = (nodeUuid: string, result: Omit<PickImageResult, "nodePageUrl">): PickImageResult => ({
    ...result,
    nodePageUrl: phylopicNodePageUrl(nodeUuid),
})

type EmbeddedNode = Readonly<{
    uuid?: string
    _embedded?: Readonly<{
        primaryImage?: ApiImageRecord | null
    }>
}>

const cladeListImages = async (
    client: PhyloPicClient,
    nodeUuid: string,
    filters: PickImageOptions,
    page: number,
): Promise<readonly ApiImageRecord[]> => {
    const list = await client.listImages({
        filter_clade: nodeUuid,
        page,
        embed_items: true,
        embed_specificNode: true,
        ...filters,
    })
    return (list._embedded?.items as ApiImageRecord[] | undefined) ?? []
}

const imageFromUuid = async (
    client: PhyloPicClient,
    imageUuid: string,
    filters: PickImageOptions,
): Promise<{ image: ApiImageRecord | null; warnings: string[] }> => {
    const warnings: string[] = []
    const full = await client.getJson<ApiImageRecord>(`/images/${imageUuid}`, {
        embed_specificNode: true,
    })
    if (!full.uuid) {
        return { image: null, warnings: ["Image record missing uuid."] }
    }
    if (!imageMatchesLicenseFilters(full._links?.license?.href, filters)) {
        warnings.push("Image does not pass the requested license filters.")
        return { image: null, warnings }
    }
    return { image: full, warnings }
}

const primaryForNode = async (client: PhyloPicClient, nodeUuid: string): Promise<ApiImageRecord | null> => {
    const node = await client.getJson<EmbeddedNode>(`/nodes/${nodeUuid}`, {
        embed_primaryImage: true,
    })
    const primary = node._embedded?.primaryImage
    if (!primary?.uuid) {
        return null
    }
    const full = await client.getJson<ApiImageRecord>(`/images/${primary.uuid}`, {
        embed_specificNode: true,
    })
    return full
}

export const pickImage = async (
    client: PhyloPicClient,
    nodeUuid: string,
    options: PickImageOptions = {},
): Promise<PickImageResult> => {
    const warnings: string[] = []
    const { image_uuid, clade_index, clade_page, ...filters } = options

    if (image_uuid) {
        const { image, warnings: loadWarnings } = await imageFromUuid(client, image_uuid, filters)
        warnings.push(...loadWarnings)
        if (image) {
            const picked = toPickedImage(image)
            if (picked) {
                warnings.push("Using image_uuid override (default primary/clade order skipped).")
                return withPageUrls(nodeUuid, { image: picked, nodeUuid, warnings })
            }
        }
        return withPageUrls(nodeUuid, { image: null, nodeUuid, warnings })
    }

    if (clade_index !== undefined) {
        const page = clade_page ?? 0
        const items = await cladeListImages(client, nodeUuid, filters, page)
        const hit = items[clade_index]
        if (!hit) {
            warnings.push(`No clade list item at page ${page} index ${clade_index}. Use find_images to browse.`)
            return withPageUrls(nodeUuid, { image: null, nodeUuid, warnings })
        }
        const picked = toPickedImage(hit)
        if (picked) {
            warnings.push(`Using clade list page ${page} index ${clade_index} (default primary/clade order skipped).`)
            return withPageUrls(nodeUuid, { image: picked, nodeUuid, warnings })
        }
        return withPageUrls(nodeUuid, { image: null, nodeUuid, warnings })
    }

    const primary = await primaryForNode(client, nodeUuid)
    if (primary) {
        const specificUuid = nodeUuidFromSpecificNodeLink(primary)
        if (specificUuid === nodeUuid && imageMatchesLicenseFilters(primary._links?.license?.href, filters)) {
            const image = toPickedImage(primary)
            if (image) {
                return withPageUrls(nodeUuid, { image, nodeUuid, warnings })
            }
        } else if (specificUuid && specificUuid !== nodeUuid) {
            warnings.push("Skipped primaryImage: specificNode does not match this node.")
        }
    }

    const cladeHit = (await cladeListImages(client, nodeUuid, filters, 0))[0]
    if (cladeHit) {
        const image = toPickedImage(cladeHit)
        if (image) {
            return withPageUrls(nodeUuid, { image, nodeUuid, warnings })
        }
    }

    return withPageUrls(nodeUuid, { image: null, nodeUuid, warnings })
}
