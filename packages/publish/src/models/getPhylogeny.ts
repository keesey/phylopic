import { Node, Source } from "@phylopic/source-models"
import { UUID } from "@phylopic/utils"
import { Arc, createAcyclicGraph, Digraph, sources } from "simple-digraph"
export interface PhylogenySourceData {
    source: Source
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
    if (!data.source) {
        throw new Error("Source metadata is missing!")
    }
    const nodeUUIDsToVertices = new Map<UUID, number>()
    const verticesToNodeUUIDs = new Map<number, UUID>()
    {
        let nextVertex = 1
        const uuids = new Set<UUID>(data.nodes.keys())
        for (const uuid of uuids) {
            nodeUUIDsToVertices.set(uuid, nextVertex)
            verticesToNodeUUIDs.set(nextVertex, uuid)
            nextVertex++
        }
    }
    const phylogenyArcs = [] as Arc[]
    const extraVertices = new Set<number>()
    const rootVertex = nodeUUIDsToVertices.get(data.source.root)
    if (!rootVertex) {
        throw new Error("Invalid root node.")
    }
    for (const [uuid, node] of data.nodes.entries()) {
        const vertex = nodeUUIDsToVertices.get(uuid)
        if (!vertex) {
            throw new Error("Inconsistency in phylogeny.")
        }
        if (vertex === rootVertex) {
            extraVertices.add(vertex)
            if (node.parent) {
                console.warn("Root node has a parent.")
                options?.handleParentedRoot?.(uuid, node)
            }
        } else if (!node.parent) {
            console.warn(`Node does not have a parent: <${uuid}>.`)
            options?.handleOrphan?.(uuid, node)
            phylogenyArcs.push([rootVertex, vertex])
        } else if (!nodeUUIDsToVertices.has(node.parent)) {
            console.warn(`Parent node does not have a vertex: <${node.parent}>. (Parent of <${uuid}>.)`)
            options?.handleOrphan?.(uuid, node)
            phylogenyArcs.push([rootVertex, vertex])
        } else {
            const parentVertex = nodeUUIDsToVertices.get(node.parent) as number
            extraVertices.add(vertex)
            phylogenyArcs.push([parentVertex, vertex])
        }
    }
    const phylogeny = createAcyclicGraph(phylogenyArcs, extraVertices)
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
