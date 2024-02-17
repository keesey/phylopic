import { Identifier, type UUID } from "@phylopic/utils"
import { type ParseResult } from "newick-js"
import { parseNomen } from "parse-nomen"
import { AugmentedPhylogeny } from "../models/AugmentedPhylogeny"
import normalizeAugmentedPhylogeny from "../normalization/normalizeAugmentedPhylogeny"
const parseNewick = (result: ParseResult): AugmentedPhylogeny => {
    const vertices = Array.from(result.graph[0])
    return normalizeAugmentedPhylogeny({
        arcs: Array.from(result.graph[1]).map(arc =>
            isFinite(arc[2])
                ? [vertices.indexOf(arc[0]), vertices.indexOf(arc[1]), arc[2]]
                : [vertices.indexOf(arc[0]), vertices.indexOf(arc[1])],
        ),
        identifiers: vertices.map(() => []),
        imageUUIDs: vertices.map(() => null),
        labelMap: vertices.map(vertex => (vertex.label ? parseNomen(vertex.label) : [])),
        vertexOrder: vertices.map((_, index) => index),
    })
}
export default parseNewick
