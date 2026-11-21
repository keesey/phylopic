import type { CladogramTreeNode } from "./types.js"

const newickAtom = (label: string): string => {
    const trimmed = label.trim()
    if (/^[A-Za-z0-9_+-]+$/.test(trimmed)) {
        return trimmed.replace(/\s+/g, "_")
    }
    return `'${trimmed.replace(/'/g, "''")}'`
}

const branchLengthSuffix = (node: CladogramTreeNode, emitIncomingLength: boolean): string => {
    if (!emitIncomingLength || node.branchLength === undefined) {
        return ""
    }
    return `:${node.branchLength}`
}

const cladogramNodeToNewick = (node: CladogramTreeNode, isTreeRoot: boolean): string => {
    const emitIncoming = !isTreeRoot
    if (node.children.length === 0) {
        if (!node.label) {
            throw new Error(`Tip node ${node.id} has no label.`)
        }
        return `${newickAtom(node.label)}${branchLengthSuffix(node, emitIncoming)}`
    }
    const inner = node.children.map(c => cladogramNodeToNewick(c, false)).join(",")
    if (node.label) {
        return `(${inner})${newickAtom(node.label)}${branchLengthSuffix(node, emitIncoming)}`
    }
    return `(${inner})${branchLengthSuffix(node, emitIncoming)}`
}

/** Unlabeled internal nodes become bare `(…)` groups; tips use their tree labels. */
export const cladogramTreeToNewick = (node: CladogramTreeNode): string => cladogramNodeToNewick(node, true)
