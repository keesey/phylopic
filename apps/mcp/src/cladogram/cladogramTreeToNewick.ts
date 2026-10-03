import type { CladogramTreeNode } from "./types.js"

const newickAtom = (label: string): string => {
    const trimmed = label.trim()
    if (/^[A-Za-z0-9_+-]+$/.test(trimmed)) {
        return trimmed.replace(/\s+/g, "_")
    }
    return `'${trimmed.replace(/'/g, "''")}'`
}

/** Unlabeled internal nodes become bare `(…)` groups; tips use their tree labels. */
export const cladogramTreeToNewick = (node: CladogramTreeNode): string => {
    if (node.children.length === 0) {
        if (!node.label) {
            throw new Error(`Tip node ${node.id} has no label.`)
        }
        return newickAtom(node.label)
    }
    const inner = node.children.map(cladogramTreeToNewick).join(",")
    return node.label ? `(${inner})${newickAtom(node.label)}` : `(${inner})`
}
