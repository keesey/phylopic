import type { CladogramTreeNode } from "./types.js"

type MutableTreeNode = Omit<CladogramTreeNode, "children"> & {
    parent?: MutableTreeNode
    children: MutableTreeNode[]
}

const cloneWithParent = (n: CladogramTreeNode, parent?: MutableTreeNode): MutableTreeNode => {
    const node: MutableTreeNode = {
        id: n.id,
        ...(n.label !== undefined ? { label: n.label } : {}),
        ...(n.branchLength !== undefined ? { branchLength: n.branchLength } : {}),
        children: [],
        parent,
    }
    node.children = n.children.map(c => cloneWithParent(c, node))
    return node
}

const collectFlat = (node: MutableTreeNode, out: MutableTreeNode[]) => {
    out.push(node)
    for (const c of node.children) collectFlat(c, out)
}

const isTip = (n: MutableTreeNode) => n.children.length === 0

const tipsUnder = (n: MutableTreeNode): MutableTreeNode[] => {
    if (isTip(n)) return [n]
    return n.children.flatMap(c => tipsUnder(c))
}

const depth = (n: MutableTreeNode): number => {
    let d = 0
    let p = n.parent
    while (p) {
        d++
        p = p.parent
    }
    return d
}

const tipIdsUnder = (n: MutableTreeNode): string[] => tipsUnder(n).map(t => t.id)

const isOnPathToTip = (
    ancestorId: string,
    tipId: string,
    byId: ReadonlyMap<string, MutableTreeNode>,
): boolean => ancestorId === tipId || isStrictAncestorOf(ancestorId, tipId, byId)

/** Deepest Newick node that is an ancestor of every listed tip (may be a tip). */
export const mrcaNodeIdForTipIds = (
    tipIds: readonly string[],
    all: readonly MutableTreeNode[],
    byId: ReadonlyMap<string, MutableTreeNode>,
): string | undefined => {
    if (!tipIds.length) return undefined
    const candidates = all.filter(n => tipIds.every(tid => isOnPathToTip(n.id, tid, byId)))
    if (!candidates.length) return undefined
    candidates.sort((a, b) => depth(b) - depth(a))
    return candidates[0]!.id
}

const idByNode = (all: readonly MutableTreeNode[]): ReadonlyMap<string, MutableTreeNode> =>
    new Map(all.map(n => [n.id, n]))

/** True when `ancestorId` is a strict ancestor of `nodeId` on the Newick tree. */
const isStrictAncestorOf = (
    ancestorId: string,
    nodeId: string,
    byId: ReadonlyMap<string, MutableTreeNode>,
): boolean => {
    let cur = byId.get(nodeId)
    while (cur?.parent) {
        cur = cur.parent
        if (cur.id === ancestorId) return true
    }
    return false
}

const conflictsWithPlannedRimClade = (
    candidateId: string,
    planned: readonly string[],
    byId: ReadonlyMap<string, MutableTreeNode>,
): boolean =>
    planned.some(
        p =>
            p !== candidateId &&
            (isStrictAncestorOf(candidateId, p, byId) || isStrictAncestorOf(p, candidateId, byId)),
    )

/**
 * For labeled-tip radial figures: choose internal (or root) Newick nodes for rim silhouettes.
 * Prefer the smallest clade whose assigned node has illustration; walk toward the root when not.
 * Never plan both a clade and any of its superclades (or subclades). Direct tip silhouettes mark
 * those tips covered; rim silhouettes apply only to the MRCA of still-unillustrated tips (so a fork
 * of an illustrated tip and an unillustrated sibling is not rimmed as one clade).
 */
const planningMrcaForInternal = (
    n: MutableTreeNode,
    uncoveredTipIds: readonly string[],
    all: readonly MutableTreeNode[],
    byId: ReadonlyMap<string, MutableTreeNode>,
    directTipSilhouetteIds: ReadonlySet<string>,
): string | undefined => {
    const mrcaId = mrcaNodeIdForTipIds(uncoveredTipIds, all, byId)
    if (!mrcaId) return undefined
    const mrcaNode = byId.get(mrcaId)
    if (!mrcaNode?.parent || !isTip(mrcaNode)) return mrcaId

    const illustratedTipUnderN = tipIdsUnder(n).some(tid => directTipSilhouetteIds.has(tid))
    if (illustratedTipUnderN) return mrcaId

    if (mrcaNode.parent.id === n.id) return n.id
    return mrcaId
}

export const planRadialCladeRimSilhouetteNodeIds = (
    root: CladogramTreeNode,
    hasIllustration: (newickNodeId: string) => boolean,
    options: Readonly<{ tipsWithDirectSilhouettes?: readonly string[] }> = {},
): readonly string[] => {
    const tree = cloneWithParent(root)
    const all: MutableTreeNode[] = []
    collectFlat(tree, all)
    const byId = idByNode(all)
    const internals = all.filter(n => !isTip(n)).sort((a, b) => depth(b) - depth(a))

    const coveredTipIds = new Set(options.tipsWithDirectSilhouettes ?? [])
    const directTipSilhouetteIds = new Set(options.tipsWithDirectSilhouettes ?? [])
    const planned: string[] = []

    for (const n of internals) {
        const uncoveredTipIds = tipIdsUnder(n).filter(tid => !coveredTipIds.has(tid))
        if (!uncoveredTipIds.length) continue

        const planningMrcaId = planningMrcaForInternal(n, uncoveredTipIds, all, byId, directTipSilhouetteIds)
        if (planningMrcaId !== n.id) continue

        let cur: MutableTreeNode | undefined = n
        while (cur) {
            if (hasIllustration(cur.id) && !conflictsWithPlannedRimClade(cur.id, planned, byId)) {
                if (!planned.includes(cur.id)) planned.push(cur.id)
                for (const tid of uncoveredTipIds) {
                    if (isOnPathToTip(cur.id, tid, byId)) coveredTipIds.add(tid)
                }
                break
            }
            cur = cur.parent
        }
    }

    return planned
}
