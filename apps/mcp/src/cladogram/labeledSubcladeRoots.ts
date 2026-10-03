import type { CladogramTreeNode } from "./types.js"

/** Labels on minimal labeled nodes in each child branch (for unlabeled internal nodes). */
export const collectLabeledSubcladeRootLabels = (node: CladogramTreeNode): readonly string[] => {
    const out: string[] = []
    for (const child of node.children) {
        if (child.label) {
            out.push(child.label)
        } else {
            out.push(...collectLabeledSubcladeRootLabels(child))
        }
    }
    return out
}

export const isUnlabeledInternalNode = (node: CladogramTreeNode): boolean =>
    !node.label && node.children.length > 0
