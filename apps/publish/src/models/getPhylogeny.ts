import { Node } from "@phylopic/source-models"
import { UUID } from "@phylopic/utils"
import { Arc, createAcyclicGraph, Digraph, sources } from "simple-digraph"
export interface PhylogenySourceData {
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
    let rootVertex: number | undefined
    for (const [uuid, node] of data.nodes.entries()) {
        const vertex = nodeUUIDsToVertices.get(uuid)
        if (!vertex) {
            throw new Error("Inconsistency in phylogeny.")
        }
        if (!node.parent) {
            rootVertex = vertex
            extraVertices.add(vertex)
        } else if (!nodeUUIDsToVertices.has(node.parent)) {
            console.warn(`Parent node does not have a vertex: <${node.parent}>. (Parent of <${uuid}>.)`)
            options?.handleOrphan?.(uuid, node)
            extraVertices.add(vertex)
        } else {
            const parentVertex = nodeUUIDsToVertices.get(node.parent) as number
            phylogenyArcs.push([parentVertex, vertex])
        }
    }
    const phylogeny = createAcyclicGraph(phylogenyArcs, extraVertices)
    const sourceVertices = sources(phylogeny)
    if (rootVertex === undefined) {
        throw new Error("Root not found!")
    }
    if (sourceVertices.size === 0) {
        throw new Error("Phylogeny has no root!")
    }
    if (sourceVertices.size > 1) {
        throw new Error("Phylogeny has multiple roots!")
    }
    if (!sourceVertices.has(rootVertex)) {
        throw new Error("Something weird happened looking for the root!")
    }
    return {
        nodeUUIDsToVertices,
        phylogeny,
        verticesToNodeUUIDs,
    }
}
export default getPhylogeny
