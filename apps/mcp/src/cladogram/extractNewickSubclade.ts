import { cladogramTreeToNewick } from "./cladogramTreeToNewick.js"
import type { CladogramTreeNode } from "./types.js"

/** Depth-first search for a labeled internal or tip by exact label match. */
export const findCladogramNodeByLabel = (
    root: CladogramTreeNode,
    label: string,
): CladogramTreeNode | undefined => {
    if (root.label === label) {
        return root
    }
    for (const child of root.children) {
        const found = findCladogramNodeByLabel(child, label)
        if (found) {
            return found
        }
    }
    return undefined
}

/**
 * Newick for a labeled subclade (topology + branch lengths preserved; root incoming edge omitted).
 */
export const newickSubcladeByLabel = (root: CladogramTreeNode, cladeLabel: string): string => {
    const sub = findCladogramNodeByLabel(root, cladeLabel)
    if (!sub) {
        throw new Error(`No node with label "${cladeLabel}" in tree.`)
    }
    return `${cladogramTreeToNewick(sub)};`
}
