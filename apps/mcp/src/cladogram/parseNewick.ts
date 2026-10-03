import { parse, type Arc, type Vertex } from "newick-js"
import type { CladogramTree, CladogramTreeNode } from "./types.js"

const DEFAULT_MAX_TIPS = 500
const DEFAULT_MAX_LENGTH = 100_000

type ChildLink = Readonly<{ child: Vertex; branchLength?: number }>

const indexChildren = (arcs: ReadonlySet<Arc>): Map<Vertex, ChildLink[]> => {
    const map = new Map<Vertex, ChildLink[]>()
    for (const [parent, child, weight] of arcs) {
        const list = map.get(parent) ?? []
        list.push({
            branchLength: Number.isFinite(weight) ? weight : undefined,
            child,
        })
        map.set(parent, list)
    }
    return map
}

const countTips = (node: CladogramTreeNode): number => {
    if (node.children.length === 0) {
        return 1
    }
    return node.children.reduce((sum, child) => sum + countTips(child), 0)
}

export const parseNewickToTree = (
    newick: string,
    options: { maxTips?: number; maxLength?: number } = {},
): CladogramTree => {
    const maxTips = options.maxTips ?? DEFAULT_MAX_TIPS
    const maxLength = options.maxLength ?? DEFAULT_MAX_LENGTH
    if (newick.length > maxLength) {
        throw new Error(`Newick string exceeds maximum length (${maxLength}).`)
    }

    const { graph, root } = parse(newick.trim())
    const [, arcs] = graph
    const childrenByParent = indexChildren(arcs)
    const idByVertex = new WeakMap<Vertex, string>()
    let nextId = 0

    const buildNode = (vertex: Vertex): CladogramTreeNode => {
        let id = idByVertex.get(vertex)
        if (!id) {
            id = `n${nextId++}`
            idByVertex.set(vertex, id)
        }
        const childLinks = childrenByParent.get(vertex) ?? []
        const children = childLinks.map(({ branchLength, child }) => {
            const built = buildNode(child)
            return branchLength === undefined ? built : { ...built, branchLength }
        })
        const label = vertex.label?.trim()
        return {
            children,
            id,
            ...(label ? { label } : {}),
        }
    }

    const rootNode = buildNode(root)
    const tipCount = countTips(rootNode)
    if (tipCount > maxTips) {
        throw new Error(`Newick tree has ${tipCount} tips; maximum is ${maxTips}.`)
    }

    return { root: rootNode, tipCount }
}
