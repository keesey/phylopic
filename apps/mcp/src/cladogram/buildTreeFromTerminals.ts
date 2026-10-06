import {
    buildTreeFromTerminalLineages,
    compareTerminalBranches,
    concestorNodeUuid,
    childTowardTip,
    type TerminalTaxon,
} from "@phylopic/diagrams"
import type { PhyloPicClient } from "../client/PhyloPicClient.js"
import { fetchLineageUuids } from "./fetchLineageUuids.js"
import { resolveLabelForCladogramNode } from "./resolveLabelViaDescendantPhylogeny.js"
import { cladogramTreeToNewick } from "./cladogramTreeToNewick.js"
import type { CladogramTree } from "./types.js"

export type { TerminalTaxon }
export { buildTreeFromTerminalLineages, compareTerminalBranches, concestorNodeUuid, childTowardTip }

export type BuildTreeFromTerminalsResult = Readonly<{
    tree: CladogramTree
    /** Concestor-only topology; unlabeled internals are `(…)` groups. Feed to `parse_newick` for the usual workflow. */
    newick: string
    /** PhyloPic node UUID for each tree node id (tips and unlabeled internals). */
    nodeUuidByTreeId: Readonly<Record<string, string>>
    terminals: readonly TerminalTaxon[]
    warnings: readonly string[]
}>

export const buildTreeFromTerminalLabels = async (
    client: PhyloPicClient,
    labels: readonly string[],
): Promise<BuildTreeFromTerminalsResult> => {
    const trimmed = labels.map(l => l.trim()).filter(Boolean)
    if (!trimmed.length) {
        throw new Error("At least one terminal label is required.")
    }
    const warnings: string[] = []
    const terminals: TerminalTaxon[] = []
    for (const label of trimmed) {
        const resolved = await resolveLabelForCladogramNode(client, label, [], { contextLabels: trimmed })
        terminals.push({ label, nodeUuid: resolved.nodeUuid })
        warnings.push(...resolved.warnings)
    }
    const lineagesByTipUuid = new Map<string, readonly string[]>()
    for (const t of terminals) {
        lineagesByTipUuid.set(t.nodeUuid, await fetchLineageUuids(client, t.nodeUuid))
    }
    const { root, nodeUuidByTreeId } = buildTreeFromTerminalLineages(terminals, lineagesByTipUuid)
    const tree = { root, tipCount: terminals.length }
    return {
        tree,
        newick: cladogramTreeToNewick(root),
        nodeUuidByTreeId,
        terminals,
        warnings,
    }
}
