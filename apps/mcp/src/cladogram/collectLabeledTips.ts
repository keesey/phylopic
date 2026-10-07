import type { CladogramTreeNode } from "./types.js"

/** Terminal nodes that carry a Newick label (for tip resolution and silhouettes). */
export const collectLabeledTips = (n: CladogramTreeNode): CladogramTreeNode[] =>
    n.children.length === 0 ? (n.label ? [n] : []) : n.children.flatMap(collectLabeledTips)
