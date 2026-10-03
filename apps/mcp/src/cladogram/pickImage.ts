import type { PhyloPicClient } from "../client/PhyloPicClient.js"
import { nodeUuidFromSpecificNodeLink, toPickedImage, type ApiImageRecord } from "./imageRecord.js"
import { imageMatchesLicenseFilters } from "./licenseFilters.js"
import type { LicenseFilters, PickImageResult } from "./types.js"

type EmbeddedNode = Readonly<{
    uuid?: string
    _embedded?: Readonly<{
        primaryImage?: ApiImageRecord | null
    }>
}>

const firstCladeImage = async (
    client: PhyloPicClient,
    nodeUuid: string,
    filters: LicenseFilters,
): Promise<ApiImageRecord | null> => {
    const list = await client.listImages({
        filter_clade: nodeUuid,
        page: 0,
        embed_items: true,
        embed_specificNode: true,
        ...filters,
    })
    const items = list._embedded?.items as ApiImageRecord[] | undefined
    return items?.[0] ?? null
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
    filters: LicenseFilters = {},
): Promise<PickImageResult> => {
    const warnings: string[] = []

    const primary = await primaryForNode(client, nodeUuid)
    if (primary) {
        const specificUuid = nodeUuidFromSpecificNodeLink(primary)
        if (specificUuid === nodeUuid && imageMatchesLicenseFilters(primary._links?.license?.href, filters)) {
            const image = toPickedImage(primary)
            if (image) {
                return { image, nodeUuid, warnings }
            }
        } else if (specificUuid && specificUuid !== nodeUuid) {
            warnings.push("Skipped primaryImage: specificNode does not match this node.")
        }
    }

    const cladeHit = await firstCladeImage(client, nodeUuid, filters)
    if (cladeHit) {
        const image = toPickedImage(cladeHit)
        if (image) {
            return { image, nodeUuid, warnings }
        }
    }

    return { image: null, nodeUuid, warnings }
}
