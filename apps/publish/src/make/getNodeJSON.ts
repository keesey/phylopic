import { Link, Node, TitledLink } from "@phylopic/api-models"
import { Entity, Image } from "@phylopic/source-models"
import { isDefined, isString, UUID } from "@phylopic/utils"
import { immediateSuccessors } from "simple-digraph"
import type { SourceData } from "./getSourceData.js"
const getChildNodes = (vertex: number, data: SourceData): readonly Link[] => {
    const childVertices = immediateSuccessors(data.phylogeny, new Set([vertex]))
    return [...childVertices]
        .map(v => data.verticesToNodeUUIDs.get(v))
        .filter(isString)
        .sort(
            (a, b) =>
                (data.sortIndices.get(a) ?? Number.MAX_SAFE_INTEGER) -
                (data.sortIndices.get(b) ?? Number.MAX_SAFE_INTEGER),
        )
        .map(childUUID => ({ href: `/nodes/${childUUID}?build=${data.build}` }))
}
const compareImageEntitiesByCreated = (a: Entity<Image>, b: Entity<Image>) => {
    const aValue = a.value.created + a.uuid
    const bValue = b.value.created + b.uuid
    if (aValue < bValue) {
        return -1
    }
    if (bValue < aValue) {
        return 1
    }
    return 0
}
const getDirectImage = (uuid: UUID, data: SourceData): Entity<Image> | null => {
    const imageEntities = [...data.illustration.entries()]
        .filter(([, nodeUUIDs]) => nodeUUIDs.includes(uuid))
        .map<Entity<Image> | undefined>(([imageUUID]) => {
            const value = data.images.get(imageUUID)
            if (!value) {
                console.warn(`Image not found! (UUID=${imageUUID})`)
            } else {
                return { uuid: imageUUID, value }
            }
        })
        .filter(isDefined)
    if (!imageEntities.length) {
        return null
    }
    return imageEntities.sort(compareImageEntitiesByCreated)[0]
}
const getImageCandidatesFromSuccessors = (
    uuid: UUID,
    data: SourceData,
): Iterable<{ depth: number; entity: Entity<Image>; sortIndex: number }> => {
    const imageEntity = getDirectImage(uuid, data)
    if (imageEntity) {
        return [
            {
                depth: data.depths.get(uuid) ?? Infinity,
                entity: imageEntity,
                sortIndex: data.sortIndices.get(uuid) ?? Infinity,
            },
        ]
    }
    const vertex = data.nodeUUIDsToVertices.get(uuid)
    const children = [...data.phylogeny[1].values()]
        .filter(([head]) => head === vertex)
        .map(([, tail]) => data.verticesToNodeUUIDs.get(tail))
        .filter(isString)
    return children.reduce<Array<{ depth: number; entity: Entity<Image>; sortIndex: number }>>(
        (prev, childUUID) => [...prev, ...getImageCandidatesFromSuccessors(childUUID, data)],
        [],
    )
}
const getImageFromSuccessors = (uuid: UUID, data: SourceData): Entity<Image> | null => {
    const candidates = getImageCandidatesFromSuccessors(uuid, data)
    const lead = [...candidates].sort((a, b) => a.depth - b.depth || a.sortIndex - b.sortIndex)[0]
    return lead?.entity ?? null
}
const getImageFromPredecessors = (uuid: UUID, data: SourceData): Entity<Image> | null => {
    const { parent } = data.nodes.get(uuid) ?? {}
    if (!parent) {
        return null
    }
    return getDirectImage(parent, data) ?? getImageFromPredecessors(parent, data)
}
const getPrimaryImage = (uuid: UUID, data: SourceData): Link | null => {
    const imageEntity =
        getDirectImage(uuid, data) ?? getImageFromSuccessors(uuid, data) ?? getImageFromPredecessors(uuid, data)
    if (!imageEntity) {
        return null
    }
    return {
        href: `/images/${imageEntity.uuid}?build=${data.build}`,
    }
}
const getExternal = (uuid: UUID, data: SourceData) => {
    const href = `/nodes/${uuid}`
    return [...data.externals.entries()]
        .filter(([path, link]) => link.href === href && !path.startsWith("phylopic.org"))
        .sort(([pathA], [pathB]) => (pathA < pathB ? -1 : pathA > pathB ? 1 : 0))
        .map(
            ([path, link]) =>
                ({
                    href: `/resolve/${path}?build=${data.build}`,
                    title: link.title,
                } as TitledLink),
        )
}
const hasImages = (nodeUUID: UUID, data: SourceData): boolean => {
    return Array.from(data.images.keys()).some(imageUUID => data.illustration.get(imageUUID)?.includes(nodeUUID))
}
const getCladeImagesUUID = (uuid: UUID, data: SourceData): UUID => {
    if (hasImages(uuid, data)) {
        return uuid
    }
    const vertex = data.nodeUUIDsToVertices.get(uuid)
    if (!vertex) {
        // Fail gracefully
        return uuid
    }
    const childVertices = immediateSuccessors(data.phylogeny, new Set([vertex]))
    if (childVertices.size !== 1) {
        return uuid
    }
    const childVertex = Array.from(childVertices)[0]
    const childUUID = data.verticesToNodeUUIDs.get(childVertex)
    if (!childUUID) {
        // Fail gracefully
        return uuid
    }
    return getCladeImagesUUID(childUUID, data)
}
const getNodeJSON = (uuid: UUID, data: SourceData): Node => {
    uuid = uuid.toLowerCase()
    const root = uuid === data.source.root
    const sourceNode = data.nodes.get(uuid)
    if (!sourceNode) {
        throw new Error(`Source node not found! (UUID=${uuid})`)
    }
    const vertex = data.nodeUUIDsToVertices.get(uuid)
    if (vertex === undefined) {
        throw new Error(`Vertex not found! (UUID=${uuid})`)
    }
    if (!root && !sourceNode.parent) {
        throw new Error(`Parent not found! (UUID=${uuid})`)
    }
    const cladeImagesUUID = getCladeImagesUUID(uuid, data)
    return {
        _links: {
            childNodes: getChildNodes(vertex, data),
            cladeImages: { href: `/images?build=${data.build}&filter_clade=${cladeImagesUUID}` },
            external: getExternal(uuid, data),
            images: { href: `/images?build=${data.build}&filter_node=${uuid}` },
            lineage: { href: `/nodes/${uuid}/lineage?build=${data.build}` },
            parentNode: sourceNode.parent ? { href: `/nodes/${sourceNode.parent}?build=${data.build}` } : null,
            primaryImage: getPrimaryImage(uuid, data),
            self: { href: `/nodes/${uuid}?build=${data.build}` },
        },
        build: data.build,
        created: sourceNode.created,
        names: sourceNode.names,
        uuid,
    }
}
export default getNodeJSON
