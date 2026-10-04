import { normalizeUUID } from "@phylopic/utils"
import type { ResolveLabelResult } from "./resolveLabelToNode.js"
import { isExactNodeTitleMatch } from "../search/phylopicNameMatch.js"

/** Synonym redirect where the PhyloPic node title is not the same name (e.g. Physalis → Physalia). */
export const isCrossHomonymSynonymResolution = (label: string, result: ResolveLabelResult): boolean => {
    const synonym = result.warnings.some(w => w.includes("is another name of PhyloPic node"))
    if (!synonym) {
        return false
    }
    return !isExactNodeTitleMatch(result.title, label)
}

export const isFallbackNameResolution = (result: ResolveLabelResult): boolean =>
    result.warnings.some(w => w.includes("No exact PhyloPic title match"))

/**
 * Whether this label→node resolution is safe for cladogram silhouettes and node links.
 * Rejects filter_name fallbacks and cross-homonym synonym redirects.
 */
export const isTrustedCladogramLabelResolution = (label: string, result: ResolveLabelResult): boolean => {
    if (isCrossHomonymSynonymResolution(label, result)) {
        return false
    }
    if (isFallbackNameResolution(result)) {
        return false
    }
    return isExactNodeTitleMatch(result.title, label)
}

/** True when the candidate appears on another peer’s tip→root lineage (not its own). */
export const isNodeOnAnyPeerLineage = (
    candidateUuid: string,
    peerLineages: readonly (readonly string[])[],
    peerNodeUuids: readonly string[],
): boolean => {
    const norm = normalizeUUID(candidateUuid)
    for (let i = 0; i < peerLineages.length; i++) {
        const peerUuid = peerNodeUuids[i]
        if (peerUuid && normalizeUUID(peerUuid) === norm) {
            continue
        }
        if (peerLineages[i]!.some(uuid => normalizeUUID(uuid) === norm)) {
            return true
        }
    }
    return false
}
