import {
    fetchGbifNameUsage,
    searchExternalTaxa,
    suggestGbifSpecies,
    type GBIFRank,
} from "@phylopic/search"
import type { PhyloPicClient } from "../client/PhyloPicClient.js"
import { createResolveToPhylopic } from "../search/resolveExternalToPhylopic.js"
import { normalizeTaxonLabel } from "../search/phylopicNameMatch.js"
import { assertTrustedCladogramLabelResolution } from "./cladogramResolutionTrust.js"
import type { ResolveLabelOptions, ResolveLabelResult } from "./resolveLabelToNode.js"
import { resolveLabelToNode } from "./resolveLabelToNode.js"

const GBIF_RANKS: readonly GBIFRank[] = ["species", "genus", "family", "order", "class", "phylum", "kingdom"]

export type SupercladeRank = GBIFRank | "other"

export type SupercladeCandidate = Readonly<{
    nodeUuid: string
    title?: string
    rank: SupercladeRank
    matchedLabel: string
    source: "direct" | "tree_ancestor" | "external_gbif" | "external_search"
    warnings: readonly string[]
}>

/** Lower score = finer (more specific) clade rank. */
export const supercladeRankScore = (rank: SupercladeRank): number => {
    const order: SupercladeRank[] = ["species", "genus", "family", "order", "class", "phylum", "kingdom", "other"]
    const i = order.indexOf(rank)
    return i === -1 ? 50 : i
}

const rankScore = supercladeRankScore

const sourceTieBreak = (source: SupercladeCandidate["source"]): number => {
    switch (source) {
        case "direct":
            return 0
        case "external_gbif":
            return 1
        case "external_search":
            return 2
        case "tree_ancestor":
            return 3
    }
}

/** Reject obvious cross-kingdom GBIF/autocomplete noise (e.g. fish family Cepolidae → Stylommatophora). */
export const isExternalPhylopicMismatch = (query: string, phylopicTitle: string | undefined): boolean => {
    const q = query.trim()
    const t = phylopicTitle?.trim() ?? ""
    if (!q || !t) return false
    if (/idae$/i.test(q) && /Stylommatophora/i.test(t)) return true
    if (/idae$/i.test(q) && /Proetida/i.test(t)) return true
    return false
}

const inferRankFromLabel = (label: string): SupercladeRank => {
    const t = label.trim()
    if (/^\S+\s+\S+/.test(t)) return "species"
    if (/idae$/i.test(t)) return "family"
    if (/inae$/i.test(t)) return "family"
    if (/oidei$/i.test(t)) return "family"
    if (/formes$/i.test(t)) return "order"
    return "genus"
}

export const pickFinestSupercladeCandidate = (
    candidates: readonly SupercladeCandidate[],
): SupercladeCandidate | undefined => {
    if (!candidates.length) return undefined
    return [...candidates].sort((a, b) => {
        const dr = rankScore(a.rank) - rankScore(b.rank)
        if (dr !== 0) return dr
        return sourceTieBreak(a.source) - sourceTieBreak(b.source)
    })[0]
}

const tryTrustedNameResolve = async (
    client: PhyloPicClient,
    label: string,
    options: ResolveLabelOptions,
    source: SupercladeCandidate["source"],
): Promise<SupercladeCandidate | null> => {
    try {
        const result = await resolveLabelToNode(client, label, options)
        assertTrustedCladogramLabelResolution(label, result)
        return {
            nodeUuid: result.nodeUuid,
            title: result.title,
            rank: source === "direct" ? inferRankFromLabel(label) : inferRankFromLabel(label),
            matchedLabel: label,
            source,
            warnings: result.warnings,
        }
    } catch {
        return null
    }
}

const pickGbifSpecies = async (label: string) => {
    const suggestions = await suggestGbifSpecies(label, 12)
    const norm = normalizeTaxonLabel(label)
    return suggestions.find(s => normalizeTaxonLabel(s.title) === norm) ?? suggestions[0] ?? null
}

const gbifRankCandidates = async (
    resolve: ReturnType<typeof createResolveToPhylopic>,
    speciesKey: number,
    queryLabel: string,
): Promise<SupercladeCandidate[]> => {
    const usage = await fetchGbifNameUsage(speciesKey)
    if (!usage) return []
    const out: SupercladeCandidate[] = []
    for (const rank of GBIF_RANKS) {
        const name = usage[rank]
        const key = usage[`${rank}Key`]
        if (!name || typeof key !== "number") continue
        const phylopic = await resolve("gbif.org", "species", [String(key)])
        if (!phylopic?.uuid || isExternalPhylopicMismatch(queryLabel, phylopic.title)) continue
        out.push({
            nodeUuid: phylopic.uuid,
            title: phylopic.title,
            rank,
            matchedLabel: name,
            source: "external_gbif",
            warnings: [
                `No exact PhyloPic match for "${queryLabel}"; using GBIF ${rank} "${name}" → PhyloPic "${phylopic.title ?? phylopic.uuid}".`,
            ],
        })
        break
    }
    return out
}

export type ResolveSmallestSupercladeOptions = ResolveLabelOptions &
    Readonly<{
        /** Labeled internal nodes from root toward the immediate parent. */
        labeledAncestorLabels?: readonly string[]
    }>

/**
 * When a Newick label does not resolve directly in PhyloPic, collect the finest
 * resolvable superclade from external taxonomies (GBIF rank-up + OTL/PBDB search)
 * and labeled Newick ancestors.
 */
export const resolveSmallestSuperclade = async (
    client: PhyloPicClient,
    queryLabel: string,
    options: ResolveSmallestSupercladeOptions = {},
): Promise<ResolveLabelResult | null> => {
    const query = queryLabel.trim()
    if (!query) return null

    const candidates: SupercladeCandidate[] = []

    const direct = await tryTrustedNameResolve(client, query, options, "direct")
    if (direct) candidates.push(direct)

    const ancestors = options.labeledAncestorLabels ?? []
    for (const anc of [...ancestors].reverse()) {
        const hit = await tryTrustedNameResolve(client, anc, options, "tree_ancestor")
        if (hit) candidates.push(hit)
    }

    const resolve = createResolveToPhylopic(client)
    const external = await searchExternalTaxa(query, { limitPerSource: 8, resolve })
    for (const hit of external) {
        const uuid = hit.phylopic?.uuid
        if (!uuid || isExternalPhylopicMismatch(query, hit.phylopic?.title)) continue
        if (normalizeTaxonLabel(hit.title) === normalizeTaxonLabel(query)) {
            candidates.push({
                nodeUuid: uuid,
                title: hit.phylopic?.title,
                rank: inferRankFromLabel(hit.title),
                matchedLabel: hit.title,
                source: "external_search",
                warnings: [
                    `No exact PhyloPic match for "${query}"; using ${hit.authority} "${hit.title}" → PhyloPic "${hit.phylopic?.title ?? uuid}".`,
                ],
            })
        }
    }

    const gbifPick = await pickGbifSpecies(query)
    if (gbifPick) {
        candidates.push(...(await gbifRankCandidates(resolve, gbifPick.key, query)))
    }

    const best = pickFinestSupercladeCandidate(candidates)
    if (!best) return null

    return {
        nodeUuid: best.nodeUuid,
        title: best.title,
        warnings: best.warnings,
    }
}
