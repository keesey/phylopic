import { Main, Node, UUID } from "phylopic-source-models/src/types"
import { Arc, createAcyclicGraph, Digraph, sources } from "simple-digraph"
export interface PhylogenySourceData {
    main: Main
    nodes: ReadonlyMap<UUID, Node>
}
export interface PhylogenyOptions {
    handleParentedRoot?: (uuid: UUID, node: Node) => void
    handleOrphan?: (uuid: UUID, node: Node) => void
}
export interface PhylogenyResult {
    nodeUUIDsToVertices: ReadonlyMap<UUID, number>
    phylogeny: Digraph
    verticesToNodeUUIDs: ReadonlyMap<number, UUID>
}
const getPhylogeny = (data: PhylogenySourceData, options?: PhylogenyOptions): PhylogenyResult => {
    if (!data.main) {
        throw new Error("Main metadata is missing!")
    }
    let nextVertex = 1
    const nodeUUIDsToVertices = new Map<UUID, number>()
    const verticesToNodeUUIDs = new Map<number, UUID>()
    for (const uuid of data.nodes.keys()) {
        nodeUUIDsToVertices.set(uuid, nextVertex)
        verticesToNodeUUIDs.set(nextVertex, uuid)
        nextVertex++
    }
    const phylogenyArcs = [] as Arc[]
    const vertices = [] as number[]
    const rootVertex = nodeUUIDsToVertices.get(data.main.root)
    if (!rootVertex) {
        throw new Error("Invalid root node.")
    }
    for (const [uuid, node] of data.nodes.entries()) {
        const vertex = nodeUUIDsToVertices.get(uuid)
        if (!vertex) {
            throw new Error("Inconsistency in phylogeny.")
        }
        if (vertex === rootVertex) {
            vertices.push(vertex)
            if (node.parent) {
                console.warn("Removing parent from root node.")
                options?.handleParentedRoot?.(uuid, node)
            }
        } else if (!node.parent) {
            console.warn(`Attempting to root node which does not have a parent: <${uuid}>.`)
            options?.handleOrphan?.(uuid, node)
            phylogenyArcs.push([rootVertex, vertex])
        } else {
            const parentVertex = nodeUUIDsToVertices.get(node.parent)
            if (!parentVertex) {
                console.warn(`Attempting to root node with invalid parent: <${uuid}>.`)
                options?.handleOrphan?.(uuid, node)
                phylogenyArcs.push([rootVertex, vertex])
            } else {
                vertices.push(vertex)
                phylogenyArcs.push([parentVertex, vertex])
            }
        }
    }
    const phylogeny = createAcyclicGraph(phylogenyArcs, vertices)
    const sourceVertices = sources(phylogeny)
    if (sourceVertices.size === 0) {
        throw new Error("Phylogeny has no root!")
    }
    if (sourceVertices.size > 1) {
        throw new Error("Phylogeny has multiple roots!")
    }
    if (!sourceVertices.has(rootVertex)) {
        throw new Error("Phylogeny has a different root than specified by main metadata!")
    }
    return {
        nodeUUIDsToVertices,
        phylogeny,
        verticesToNodeUUIDs,
    }
}
export default getPhylogeny
