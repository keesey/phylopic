import { EMPTY_UUID, normalizeUUID } from "@phylopic/utils"
import type { PhyloPicClient } from "../client/PhyloPicClient.js"
import { fetchLineageUuids } from "./fetchLineageUuids.js"
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

const listImagesForNode = async (
    client: PhyloPicClient,
    nodeUuid: string,
    filters: PickImageOptions,
    page: number,
    imageList: "clade" | "node",
): Promise<readonly ApiImageRecord[]> => {
    const list = await client.listImages({
        ...(imageList === "node" ? { filter_node: nodeUuid } : { filter_clade: nodeUuid }),
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

const excludedPhyloNodes = (exclude?: readonly string[]) =>
    new Set((exclude ?? []).map(uuid => normalizeUUID(uuid)))

const tryPickAtPhyloNode = async (
    client: PhyloPicClient,
    candidateUuid: string,
    filters: PickImageOptions,
): Promise<{ image: ReturnType<typeof toPickedImage>; warnings: string[] }> => {
    const warnings: string[] = []
    const primary = await primaryForNode(client, candidateUuid)
    if (primary) {
        const specificUuid = nodeUuidFromSpecificNodeLink(primary)
        if (specificUuid === candidateUuid && imageMatchesLicenseFilters(primary._links?.license?.href, filters)) {
            const image = toPickedImage(primary)
            if (image) {
                return { image, warnings }
            }
        } else if (specificUuid && specificUuid !== candidateUuid) {
            warnings.push("Skipped primaryImage: specificNode does not match this node.")
        }
    }
    const listHit = (await listImagesForNode(client, candidateUuid, filters, 0, "node"))[0]
    if (listHit) {
        const image = toPickedImage(listHit)
        if (image) {
            return { image, warnings }
        }
    }
    return { image: null, warnings }
}

const pickAncestralSilhouette = async (
    client: PhyloPicClient,
    nodeUuid: string,
    filters: PickImageOptions,
    exclude?: readonly string[],
): Promise<{ image: ReturnType<typeof toPickedImage>; warnings: string[] }> => {
    const warnings: string[] = []
    const excluded = excludedPhyloNodes(exclude)
    const lineage = await fetchLineageUuids(client, nodeUuid)
    for (const candidateUuid of lineage) {
        if (!candidateUuid || candidateUuid === EMPTY_UUID) {
            continue
        }
        if (excluded.has(normalizeUUID(candidateUuid))) {
            warnings.push(
                `Stopped ancestral search at cladogram parent PhyloPic node ${candidateUuid} (no silhouette from ancestors above).`,
            )
            break
        }
        const attempt = await tryPickAtPhyloNode(client, candidateUuid, filters)
        warnings.push(...attempt.warnings)
        if (attempt.image) {
            if (normalizeUUID(candidateUuid) !== normalizeUUID(nodeUuid)) {
                warnings.push(
                    `Silhouette from PhyloPic node ${candidateUuid} (ancestor of cladogram node ${nodeUuid}).`,
                )
            }
            return { image: attempt.image, warnings }
        }
    }
    return { image: null, warnings }
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
    const {
        image_uuid,
        clade_index,
        clade_page,
        image_list,
        exclude_node_uuids,
        descendant_node_uuids: _desc,
        ...filters
    } = options
    const imageList = image_list ?? "clade"

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
        const items = await listImagesForNode(client, nodeUuid, filters, page, imageList)
        const hit = items[clade_index]
        if (!hit) {
            const listKind = imageList === "node" ? "node" : "clade"
            warnings.push(`No ${listKind} list item at page ${page} index ${clade_index}. Use find_images to browse.`)
            return withPageUrls(nodeUuid, { image: null, nodeUuid, warnings })
        }
        const picked = toPickedImage(hit)
        if (picked) {
            warnings.push(
                `Using ${imageList === "node" ? "node" : "clade"} list page ${page} index ${clade_index} (default primary/list order skipped).`,
            )
            return withPageUrls(nodeUuid, { image: picked, nodeUuid, warnings })
        }
        return withPageUrls(nodeUuid, { image: null, nodeUuid, warnings })
    }

    if (imageList === "ancestral") {
        const ancestral = await pickAncestralSilhouette(client, nodeUuid, filters, exclude_node_uuids)
        warnings.push(...ancestral.warnings)
        return withPageUrls(nodeUuid, { image: ancestral.image, nodeUuid, warnings })
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

    if (imageList === "node") {
        const listHit = (await listImagesForNode(client, nodeUuid, filters, 0, "node"))[0]
        if (listHit) {
            const image = toPickedImage(listHit)
            if (image) {
                return withPageUrls(nodeUuid, { image, nodeUuid, warnings })
            }
        }
        return withPageUrls(nodeUuid, { image: null, nodeUuid, warnings })
    }

    const cladeHit = (await listImagesForNode(client, nodeUuid, filters, 0, "clade"))[0]
    if (cladeHit) {
        const image = toPickedImage(cladeHit)
        if (image) {
            return withPageUrls(nodeUuid, { image, nodeUuid, warnings })
        }
    }

    return withPageUrls(nodeUuid, { image: null, nodeUuid, warnings })
}
