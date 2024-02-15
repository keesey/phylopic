import { Identifier, type UUID } from "@phylopic/utils"
import { type ParseResult } from "newick-js"
import { CladogramGraph, CladogramNode } from "../models"
import { parseNomen } from "parse-nomen"
const convertNewickParseResultToCladogramGraph = (
    result: ParseResult,
    identifierMap: Map<string, Identifier>,
    imageUUIDMap: Map<Identifier, UUID>,
): CladogramGraph => {
    const vertices = Array.from(result.graph[0])
    const arcs = Array.from(result.graph[1])
    return {
        arcs: arcs.map(arc =>
            isFinite(arc[2])
                ? [vertices.indexOf(arc[0]), vertices.indexOf(arc[1]), { weight: arc[2] }]
                : [vertices.indexOf(arc[0]), vertices.indexOf(arc[1])],
        ),
        nodes: vertices.map(vertex => {
            const identifier = vertex.label ? identifierMap.get(vertex.label) : undefined
            return {
                identifier: identifier?.split("/").map(part => decodeURIComponent(part)) as CladogramNode["identifier"],
                imageUUID: identifier ? imageUUIDMap.get(identifier) : undefined,
                label: vertex.label ? parseNomen(vertex.label) : undefined,
            }
        }),
    }
}
export default convertNewickParseResultToCladogramGraph
