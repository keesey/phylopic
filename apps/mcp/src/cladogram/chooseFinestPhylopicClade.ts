import { normalizeUUID } from "@phylopic/utils"
import type { PhyloPicClient } from "../client/PhyloPicClient.js"
import { fetchLineageUuids } from "./fetchLineageUuids.js"
import { supercladeRankScore, type SupercladeRank } from "./resolveSmallestSuperclade.js"

export type PhylopicCladeCandidate = Readonly<{
    phylopicUuid: string
    rank: SupercladeRank
}>

const isStrictAncestorUuid = async (
    client: PhyloPicClient,
    ancestorUuid: string,
    descendantUuid: string,
): Promise<boolean> => {
    if (normalizeUUID(ancestorUuid) === normalizeUUID(descendantUuid)) return false
    const lineage = await fetchLineageUuids(client, descendantUuid)
    const norm = normalizeUUID(ancestorUuid)
    return lineage.some(u => normalizeUUID(u) === norm)
}

/** When several SRS (or catalog clades) target one Newick node, keep the smallest / most specific. */
export const chooseFinestPhylopicClade = async (
    client: PhyloPicClient,
    candidates: readonly PhylopicCladeCandidate[],
): Promise<PhylopicCladeCandidate | undefined> => {
    if (!candidates.length) return undefined
    let best = candidates[0]!
    for (let i = 1; i < candidates.length; i++) {
        const c = candidates[i]!
        if (normalizeUUID(c.phylopicUuid) === normalizeUUID(best.phylopicUuid)) continue
        const rankA = supercladeRankScore(best.rank)
        const rankB = supercladeRankScore(c.rank)
        if (rankB !== rankA) {
            if (rankB < rankA) best = c
            continue
        }
        if (await isStrictAncestorUuid(client, best.phylopicUuid, c.phylopicUuid)) {
            best = c
            continue
        }
        if (await isStrictAncestorUuid(client, c.phylopicUuid, best.phylopicUuid)) {
            continue
        }
    }
    return best
}
