import { normalizeUUID } from "@phylopic/utils"
import type { PhyloPicClient } from "../client/PhyloPicClient.js"
import { fetchLineageUuids } from "./fetchLineageUuids.js"
import {
    nodeUuidFromGeneralNodeLink,
    nodeUuidFromSpecificNodeLink,
    type ApiImageRecord,
} from "@phylopic/diagrams"

/**
 * True when `targetUuid` is on the image's general→specific tagged lineage (same rule as GET /images?filter_node=).
 * With no general node, only the specific taxon matches.
 */
export const isTargetOnImageTaggedLineage = async (
    client: PhyloPicClient,
    targetUuid: string,
    image: ApiImageRecord,
): Promise<boolean> => {
    const specificUuid = nodeUuidFromSpecificNodeLink(image)
    if (!specificUuid) {
        return false
    }
    const target = normalizeUUID(targetUuid)
    if (normalizeUUID(specificUuid) === target) {
        return true
    }
    const generalUuid = nodeUuidFromGeneralNodeLink(image)
    if (!generalUuid) {
        return false
    }
    if (normalizeUUID(generalUuid) === target) {
        return true
    }
    const lineage = await fetchLineageUuids(client, specificUuid)
    const targetIdx = lineage.findIndex(uuid => normalizeUUID(uuid) === target)
    if (targetIdx < 0) {
        return false
    }
    const generalIdx = lineage.findIndex(uuid => normalizeUUID(uuid) === normalizeUUID(generalUuid))
    if (generalIdx < 0) {
        return false
    }
    return targetIdx <= generalIdx
}
