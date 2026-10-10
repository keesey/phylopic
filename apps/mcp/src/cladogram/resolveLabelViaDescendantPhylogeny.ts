import type { PhyloPicClient } from "../client/PhyloPicClient.js"
import { isExactNodeTitleMatch } from "../search/phylopicNameMatch.js"
import { fetchLineageEntries } from "./fetchLineageUuids.js"
import { resolveMrcaFromDescendants } from "./resolveMrcaFromDescendants.js"
import {
    assertResolvedAncestorOfDescendants,
    assertTrustedCladogramLabelResolution,
} from "./cladogramResolutionTrust.js"
import type { ResolveLabelOptions, ResolveLabelResult } from "./resolveLabelToNode.js"
import { resolveLabelToNode } from "./resolveLabelToNode.js"
export type ResolveCladogramNodeOptions = ResolveLabelOptions &
    Readonly<{
        /** Labeled internal nodes from root toward the immediate parent (Newick hierarchy). */
        labeledAncestorLabels?: readonly string[]
    }>

const finalizeCladogramResolution = async (
    client: PhyloPicClient,
    label: string,
    result: ResolveLabelResult,
    descendantNodeUuids: readonly string[],
): Promise<ResolveLabelResult> => {
    assertTrustedCladogramLabelResolution(label, result)
    await assertResolvedAncestorOfDescendants(client, result.nodeUuid, descendantNodeUuids)
    return result
}

/** Most leafward lineage node whose title matches label (walk from child MRCA toward root). */
export const resolveLabelViaDescendantPhylogeny = async (
    client: PhyloPicClient,
    label: string,
    descendantNodeUuids: readonly string[],
    options: ResolveLabelOptions = {},
): Promise<ResolveLabelResult> => {
    const warnings: string[] = []
    const query = label.trim()
    if (!query) {
        throw new Error("Label is required for phylogeny disambiguation.")
    }
    const unique = [...new Set(descendantNodeUuids.filter(Boolean))]
    if (unique.length < 2) {
        warnings.push("Need at least two descendant UUIDs for phylogeny disambiguation; falling back to name search.")
        return finalizeCladogramResolution(
            client,
            query,
            await resolveLabelToNode(client, query, options),
            unique,
        )
    }

    const mrca = await resolveMrcaFromDescendants(client, unique)
    warnings.push(...mrca.warnings)
    if (!mrca.mrcaUuid) {
        warnings.push("No MRCA from descendants; falling back to name search.")
        return finalizeCladogramResolution(
            client,
            query,
            await resolveLabelToNode(client, query, options),
            unique,
        )
    }

    const lineage = await fetchLineageEntries(client, mrca.mrcaUuid)
    for (const entry of lineage) {
        const title = entry.title
        if (isExactNodeTitleMatch(title, query) && entry.uuid) {
            warnings.push(
                `Disambiguated "${query}" via descendant MRCA (${mrca.mrcaUuid}) lineage → ${entry.uuid} (${title}).`,
            )
            return finalizeCladogramResolution(client, query, { nodeUuid: entry.uuid, title, warnings }, unique)
        }
    }

    warnings.push(
        `No title match for "${query}" on lineage from descendant MRCA ${mrca.mrcaUuid}; falling back to name search.`,
    )
    return finalizeCladogramResolution(
        client,
        query,
        await resolveLabelToNode(client, query, options),
        unique,
    )
}

export const resolveLabelForCladogramNode = async (
    client: PhyloPicClient,
    label: string,
    descendantNodeUuids: readonly string[],
    options: ResolveCladogramNodeOptions = {},
): Promise<ResolveLabelResult> => {
    const descendants = [...new Set(descendantNodeUuids.filter(Boolean))]
    if (descendants.length >= 2) {
        return resolveLabelViaDescendantPhylogeny(client, label, descendants, options)
    }
    return finalizeCladogramResolution(
        client,
        label,
        await resolveLabelToNode(client, label, options),
        descendants,
    )
}
