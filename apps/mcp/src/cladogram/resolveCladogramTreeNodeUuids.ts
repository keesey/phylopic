import type { PhyloPicClient } from "../client/PhyloPicClient.js"
import type { ResolveCladogramNodeOptions } from "./resolveLabelViaDescendantPhylogeny.js"
import { resolveLabelForCladogramNode } from "./resolveLabelViaDescendantPhylogeny.js"
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

const labeledAncestorsRootToParent = (node: MutableTreeNode): string[] => {
    const chain: string[] = []
    let p = node.parent
    while (p) {
        if (p.label) chain.unshift(p.label)
        p = p.parent
    }
    return chain
}

const collectFlat = (node: MutableTreeNode, out: MutableTreeNode[]) => {
    out.push(node)
    for (const c of node.children) collectFlat(c, out)
}

export type ResolveCladogramTreeOptions = ResolveCladogramNodeOptions &
    Readonly<{
        onWarning?: (message: string) => void
    }>

/**
 * Resolve PhyloPic node UUIDs for labeled cladogram nodes, deepest first, using
 * descendant constraints and smallest-superclade fallback for failed labels.
 */
export const resolveCladogramTreeNodeUuids = async (
    client: PhyloPicClient,
    root: CladogramTreeNode,
    options: ResolveCladogramTreeOptions = {},
): Promise<Record<string, string>> => {
    const tree = cloneWithParent(root)
    const all: MutableTreeNode[] = []
    collectFlat(tree, all)
    const byDepthDesc = [...all].sort((a, b) => depth(b) - depth(a))

    const contextLabels =
        options.contextLabels ??
        all.map(n => n.label).filter((l): l is string => Boolean(l))

    const nodeUuids: Record<string, string> = {}
    const warn = options.onWarning ?? (() => {})

    for (const n of byDepthDesc) {
        if (!n.label) continue
        try {
            const childUuids = n.children.map(c => nodeUuids[c.id]).filter((u): u is string => Boolean(u))
            const resolved = await resolveLabelForCladogramNode(client, n.label, childUuids, {
                contextLabels,
                ...(options.fetch ? { fetch: options.fetch } : {}),
                labeledAncestorLabels: labeledAncestorsRootToParent(n),
            })
            nodeUuids[n.id] = resolved.nodeUuid
            for (const w of resolved.warnings) warn(w)
        } catch (e) {
            warn(`Resolve ${n.label}: ${e instanceof Error ? e.message : e}`)
        }
    }

    return nodeUuids
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
