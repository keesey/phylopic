import { isIdentifier, isUUID, normalizeNomina, normalizeUUID } from "@phylopic/utils"
import { type Arc, type AugmentedPhylogeny } from "../models/AugmentedPhylogeny"
const ensureLength = <T>(array: readonly T[], length: number, defaultValue: T) => {
    if (array.length < length) {
        const result = [...array]
        result.push(defaultValue)
        while (array.length < length) {
            result.push(defaultValue)
        }
    }
    if (array.length > length) {
        return array.slice(0, length)
    }
    return array
}
const createArcComparator = (vertexOrder: readonly number[]) => (a: Arc, b: Arc) => {
    const compareVertices = createVertexComparator(vertexOrder)
    return compareVertices(a[0], b[0]) || compareVertices(a[1], b[1]) || (a[2] ?? 0) - (b[2] ?? 0)
}
const createVertexComparator = (vertexOrder: readonly number[]) => (a: number, b: number) => {
    const aIndex = vertexOrder.indexOf(a)
    const bIndex = vertexOrder.indexOf(b)
    if (aIndex < 0 && bIndex < 0) {
        return a - b
    }
    return aIndex - bIndex
}
const normalizeAugmentedPhylogeny = (p: AugmentedPhylogeny): AugmentedPhylogeny => {
    const n = Math.max(...p.vertexOrder) + 1
    const isValidVertex = (v: number) => isFinite(v) && v >= 0 && v < n && v === Math.floor(v)
    return {
        arcs: [...p.arcs]
            .filter(arc => isValidVertex(arc[0]) && isValidVertex(arc[1]) && arc[0] !== arc[1])
            .sort(createArcComparator(p.vertexOrder)),
        identifiers: ensureLength(p.identifiers, n, []).map(identifier =>
            (identifier ?? []).filter(identifier => isIdentifier(identifier)).sort(),
        ),
        imageUUIDs: ensureLength(p.imageUUIDs, n, null).map(uuid => (isUUID(uuid) ? normalizeUUID(uuid) : null)),
        labelMap: normalizeNomina(ensureLength(p.labelMap, n, []).map(nomen => nomen ?? [])),
        vertexOrder: new Array(n)
            .fill(0)
            .map((_, index) => index)
            .sort(createVertexComparator(p.vertexOrder)),
    }
}
export default normalizeAugmentedPhylogeny
