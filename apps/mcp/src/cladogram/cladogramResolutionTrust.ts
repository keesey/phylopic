import { normalizeUUID } from "@phylopic/utils"
import type { PhyloPicClient } from "../client/PhyloPicClient.js"
import { fetchLineageUuids } from "./fetchLineageUuids.js"
import type { ResolveLabelResult } from "./resolveLabelToNode.js"
import { isExactNodeTitleMatch } from "../search/phylopicNameMatch.js"

/** PhyloPic recorded the label as a synonym of the resolved node (may differ from canonical title). */
export const isPhylopicSynonymResolution = (result: ResolveLabelResult): boolean =>
    result.warnings.some(w => w.includes("is another name of PhyloPic node"))

/** Synonym redirect where the node title differs from the Newick label (e.g. Stomiiformes → Stomiatiformes). */
export const isVariantTitleSynonymResolution = (label: string, result: ResolveLabelResult): boolean =>
    isPhylopicSynonymResolution(result) && !isExactNodeTitleMatch(result.title, label)

/** @deprecated Use isVariantTitleSynonymResolution; homonyms are rejected via descendant lineage checks. */
export const isCrossHomonymSynonymResolution = isVariantTitleSynonymResolution

export const isFallbackNameResolution = (result: ResolveLabelResult): boolean =>
    result.warnings.some(w => w.includes("No exact PhyloPic title match"))

/**
 * Whether this label→node resolution is safe for cladogram silhouettes and node links.
 * Accepts exact titles and PhyloPic synonym redirects; rejects filter_name fallbacks (e.g. Alestidae → Trialestidae).
 */
export const isTrustedCladogramLabelResolution = (label: string, result: ResolveLabelResult): boolean => {
    if (isFallbackNameResolution(result)) {
        return false
    }
    if (isExactNodeTitleMatch(result.title, label)) {
        return true
    }
    return isPhylopicSynonymResolution(result)
}

/** Rejects resolutions that are not ancestors of already-resolved child nodes (e.g. Physalis → Physalia among plant tips). */
export const assertResolvedAncestorOfDescendants = async (
    client: PhyloPicClient,
    resolvedUuid: string,
    descendantUuids: readonly string[],
): Promise<void> => {
    if (!descendantUuids.length) {
        return
    }
    const resolved = normalizeUUID(resolvedUuid)
    for (const child of descendantUuids) {
        const lineage = await fetchLineageUuids(client, child)
        if (!lineage.some(uuid => normalizeUUID(uuid) === resolved)) {
            throw new Error(
                `Resolved PhyloPic node "${resolvedUuid}" is not an ancestor of descendant ${child}; "${resolvedUuid}" may be a homonym for this clade.`,
            )
        }
    }
}

/** Throws when name search would link a cladogram label to the wrong taxon (e.g. Alestidae → Trialestidae). */
export const assertTrustedCladogramLabelResolution = (label: string, result: ResolveLabelResult): void => {
    if (isTrustedCladogramLabelResolution(label, result)) {
        return
    }
    const target = result.title ?? result.nodeUuid
    throw new Error(
        `Untrusted cladogram resolution for "${label}" → "${target}". ${result.warnings.join(" ")} Use search_nodes exactMatch or node_uuid.`,
    )
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
