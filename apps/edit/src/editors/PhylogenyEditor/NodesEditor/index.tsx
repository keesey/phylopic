import { Node } from "@phylopic/source-models"
import { isDefined, stringifyNormalized, UUID } from "@phylopic/utils"
import { useContext, useMemo, FC } from "react"
import { createAcyclicGraph, immediateSuccessors, sinks, successorUnion } from "simple-digraph"
import Context from "~/contexts/PhylogenyEditorContainer/Context"
import { NodesMap } from "~/contexts/PhylogenyEditorContainer/State"
import { Arc } from "./Arc"
import ArcView from "./ArcView"
import DeletedNodes from "./DeletedNodes"
import { Vertex } from "./Vertex"
import VertexView from "./VertexView"
import VERTEX_HEIGHT from "./VERTEX_HEIGHT"
import VERTEX_SPACING from "./VERTEX_SPACING"
import VERTEX_WIDTH from "./VERTEX_WIDTH"

const nodeToVertex = (parent: Vertex | null, uuid: UUID, modified: Node, original?: Node): Vertex => ({
    changed: !original || stringifyNormalized(modified) !== stringifyNormalized(original),
    column: 0,
    row: typeof parent?.row === "number" ? parent.row + 1 : 0,
    name: modified.names[0],
    uuid,
})
type VertexMap = Record<UUID, Vertex | undefined>
const getVertex = (vertexMap: VertexMap, uuid: UUID, modified: NodesMap, original: NodesMap): Vertex => {
    const existing = vertexMap[uuid]
    if (existing) {
        return existing
    }
    const modifiedNode = modified[uuid]
    if (!modifiedNode) {
        throw new Error("No node for UUID: " + uuid)
    }
    vertexMap[uuid] = nodeToVertex(null, uuid, modifiedNode, original[uuid])
    const parent = modifiedNode.parent ? getVertex(vertexMap, modifiedNode.parent, modified, original) : null
    return (vertexMap[uuid] = nodeToVertex(parent, uuid, modifiedNode, original[uuid]))
}
const setColumns = (map: VertexMap, arcs: readonly Readonly<[UUID, UUID]>[]): VertexMap => {
    const keys = Object.keys(map).sort()
    if (keys.length <= 1) {
        return map
    }
    const digraphArcs: readonly [number, number][] = arcs.map(
        ([head, tail]) => [keys.indexOf(head), keys.indexOf(tail)] as [number, number],
    )
    const graph = createAcyclicGraph(
        digraphArcs,
        keys.map((_, index) => index),
    )
    const ratios: Record<number, number> = {}
    const setRatiosForClade = (v: number, min: number, max: number) => {
        ratios[v] = (min + max) / 2
        const children = immediateSuccessors(graph, new Set([v]))
        if (children.size > 0) {
            if (children.size === 1) {
                setRatiosForClade([...children][0], min, max)
            } else {
                const ratioPerChild = (max - min) / children.size
                const sizes = [...children].reduce<Record<number, number>>(
                    (prev, child) => ({
                        ...prev,
                        [child]: successorUnion(graph, new Set([child])).size,
                    }),
                    {},
                )
                const childrenSorted = [...children].sort((a, b) => sizes[a] - sizes[b])
                childrenSorted.forEach((child, index) =>
                    setRatiosForClade(child, min + ratioPerChild * index, min + ratioPerChild * (index + 1)),
                )
            }
        }
    }
    const rootVertex =
        digraphArcs.length === 0 ? 0 : [...graph[0]].find(v => digraphArcs.every(([, tail]) => tail !== v)) ?? 0
    setRatiosForClade(rootVertex, 0, 1)
    const sinksSorted = [...sinks(graph)].sort((a, b) => ratios[a] - ratios[b])
    const columns = sinksSorted.reduce<Record<number, number>>(
        (prev, sink) => ({ ...prev, [sink]: sinksSorted.indexOf(sink) }),
        {},
    )
    const getColumnForVertex = (v: number): number => {
        if (typeof columns[v] === "number") {
            return columns[v]
        }
        return (columns[v] = [...immediateSuccessors(graph, new Set([v]))]
            .map(getColumnForVertex)
            .reduce<number>((prev, column, _, array) => prev + column / array.length, 0))
    }
    getColumnForVertex(rootVertex)
    return [...graph[0]].reduce<VertexMap>((prev, v) => {
        const key = keys[v]
        const value = map[key]
        return value
            ? {
                  ...prev,
                  [key]: {
                      ...value,
                      column: columns[v],
                  },
              }
            : prev
    }, {})
}
const NodesEditor: FC = () => {
    const [state] = useContext(Context) ?? []
    const { modified, original } = state ?? {}
    const vertexMap = useMemo(() => {
        const map: VertexMap = {}
        if (modified?.nodesMap && original?.nodesMap) {
            Object.entries(modified.nodesMap).forEach(([uuid]) =>
                getVertex(map, uuid, modified?.nodesMap, original?.nodesMap),
            )
        }
        return modified?.arcs ? setColumns(map, modified.arcs) : map
    }, [modified?.arcs, modified?.nodesMap, original?.nodesMap])
    const arcs = useMemo<readonly Arc[]>(
        () => (modified?.arcs ?? []).map(([head, tail]) => [vertexMap[head], vertexMap[tail]] as Arc),
        [modified?.arcs, vertexMap],
    )
    const [width, height] = useMemo(() => {
        const [columns, rows] = Object.values(vertexMap).reduce<[number, number]>(
            (prev, vertex) => (vertex ? [Math.max(prev[0], vertex.column), Math.max(prev[1], vertex.row)] : prev),
            [0, 0],
        )
        return [
            (columns + 1) * (VERTEX_WIDTH + VERTEX_SPACING[0]) + VERTEX_SPACING[0] * 3 + VERTEX_WIDTH,
            (rows + 1) * (VERTEX_HEIGHT + VERTEX_SPACING[1]) + VERTEX_SPACING[1],
        ]
    }, [vertexMap])
    return (
        <div>
            <svg height={height} viewBox={`0 0 ${width} ${height}`} xmlns="http://www.w3.org/2000/svg" width={width}>
                <DeletedNodes x1={width - VERTEX_SPACING[0] * 2 - VERTEX_WIDTH} y1={0} x2={width} y2={height} />
                <g fill="none" stroke="#808080" strokeWidth={2}>
                    {arcs.map(arc => (
                        <ArcView key={`${arc[0].uuid}:${arc[1].uuid}`} arc={arc} />
                    ))}
                </g>
                <g>
                    {Object.values(vertexMap)
                        .filter(isDefined)
                        .map(vertex => (
                            <VertexView key={vertex.uuid} vertex={vertex} />
                        ))}
                </g>
            </svg>
        </div>
    )
}
export default NodesEditor
