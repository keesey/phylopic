import { TitledLink } from "phylopic-api-models"
import { Contributor, Image, isContributor, isImage, isNode, isSource, Node, Source } from "phylopic-source-models"
import { compareStrings, normalizeUUID, UUID } from "phylopic-utils"
import { Arc, Digraph } from "simple-digraph"
import listDir from "../fsutils/listDir"
import readJSON from "../fsutils/readJSON"
import getPhylogeny from "../models/getPhylogeny"
export type SourceData = Readonly<{
    build: number
    contributors: ReadonlyMap<UUID, Contributor>
    depths: ReadonlyMap<UUID, number>
    externals: ReadonlyMap<string, TitledLink>
    illustration: ReadonlyMap<UUID, readonly UUID[]>
    images: ReadonlyMap<UUID, Image>
    nodeUUIDsToVertices: ReadonlyMap<UUID, number>
    nodes: ReadonlyMap<UUID, Node>
    phylogeny: Digraph
    sortIndices: ReadonlyMap<UUID, number>
    source: Source
    verticesToNodeUUIDs: ReadonlyMap<number, UUID>
}>
export type Args = Readonly<{
    build: number
}>
type ProcessArgs = Args &
    Readonly<{
        contributors: Map<UUID, Contributor>
        depths: Map<UUID, number>
        illustration: Map<UUID, Set<UUID>>
        images: Map<UUID, Image>
        nodeUUIDsToVertices: Map<UUID, number>
        nodes: Map<UUID, Node>
        phylogenyArcs: Array<Arc>
        sortIndices: Map<UUID, number>
        verticesToNodeUUIDs: Map<number, UUID>
    }> & {
        nextVertex: number
    }
const loadSource = async (): Promise<Source> => {
    return await readJSON<Source>(".s3/source.phylopic.org/meta.json", isSource)
}
const loadImage = async (uuid: UUID, args: Pick<ProcessArgs, "images">): Promise<void> => {
    const path = `images/${normalizeUUID(uuid)}/meta.json`
    const image = await readJSON<Image>(`.s3/source.phylopic.org/${path}`, isImage)
    args.images.set(uuid, image)
}
const loadImages = async (args: Pick<ProcessArgs, "images">): Promise<void> => {
    console.info("Looking up images...")
    const uuids = await listDir(".s3/source.phylopic.org/images/")
    console.info(`Loading ${uuids.length} images...`)
    await Promise.all(uuids.map(uuid => loadImage(uuid, args)))
    console.info(`Loaded ${uuids.length} images.`)
}
const loadNode = async (uuid: UUID, args: Pick<ProcessArgs, "nodes">): Promise<void> => {
    const path = `nodes/${normalizeUUID(uuid)}/meta.json`
    const node = await readJSON<Node>(`.s3/source.phylopic.org/${path}`)
    if (!isNode(node)) {
        throw new Error(`Invalid node (UUID: "${uuid}").`)
    }
    args.nodes.set(uuid, node)
}
const loadNodes = async (args: Pick<ProcessArgs, "nodes">): Promise<void> => {
    console.info("Looking up nodes...")
    const uuids = await listDir(".s3/source.phylopic.org/nodes/")
    console.info(`Loading ${uuids.length} nodes...`)
    await Promise.all(uuids.map(uuid => loadNode(uuid, args)))
    console.info(`Loaded ${uuids.length} nodes.`)
}
const loadContributor = async (uuid: UUID, args: Pick<ProcessArgs, "contributors">): Promise<void> => {
    const path = `contributors/${normalizeUUID(uuid)}/meta.json`
    const contributor = await readJSON<Contributor>(`.s3/source.phylopic.org/${path}`)
    if (!isContributor(contributor)) {
        throw new Error(`Invalid contributor (UUID: "${uuid}").`)
    }
    args.contributors.set(uuid, contributor)
}
const loadContributors = async (args: Pick<ProcessArgs, "contributors">): Promise<void> => {
    console.info("Looking up contributors...")
    const uuids = await listDir(".s3/source.phylopic.org/contributors/")
    console.info(`Loading ${uuids.length} contributors...`)
    await Promise.all(uuids.map(uuid => loadContributor(uuid, args)))
    console.info(`Loaded ${uuids.length} contributors.`)
}
const getNodeUUIDsInLineage = (
    args: Pick<SourceData, "nodes">,
    imageUUID: UUID,
    specific: UUID,
    general?: UUID,
): readonly UUID[] => {
    if (general) {
        let current = specific
        const uuids: UUID[] = []
        do {
            const currentNode = args.nodes.get(current)
            if (!currentNode) {
                throw new Error(`Invalid node in lineage of image <${imageUUID}>: <${current}>.`)
            }
            uuids.push(current)
            if (current === general) {
                break
            }
            const parent = currentNode.parent
            if (!parent) {
                throw new Error(
                    `Invalid lineage for image <${imageUUID}>. Cannot find <${general}> in lineage: <${uuids.join(
                        ">, <",
                    )}>.`,
                )
            }
            current = parent
        } while (current)
        return uuids
    }
    return [specific]
}
const getIllustration = (args: Pick<SourceData, "images" | "nodes">): ReadonlyMap<UUID, readonly UUID[]> => {
    const map = new Map<UUID, readonly UUID[]>()
    for (const [uuid, image] of args.images.entries()) {
        const { general, specific } = image
        if (!args.nodes.has(specific)) {
            throw new Error(`Invalid specific node for image <${uuid}>.`)
        }
        if (general && !args.nodes.has(general)) {
            throw new Error(`Invalid general node for image <${uuid}>.`)
        }
        map.set(uuid, getNodeUUIDsInLineage(args, uuid, specific, general))
    }
    return map
}
const processClade = (
    args: Pick<SourceData, "phylogeny" | "verticesToNodeUUIDs"> &
        Pick<ProcessArgs, "depths" | "sortIndices"> & { sizes: ReadonlyMap<number, number>; sortIndex: number },
    vertex: number,
    depth: number,
) => {
    const uuid = args.verticesToNodeUUIDs.get(vertex)
    if (typeof uuid !== "string") {
        throw new Error("Cannot find UUID for vertex.")
    }
    args.depths.set(uuid, depth)
    args.sortIndices.set(uuid, args.sortIndex++)
    ;[...args.phylogeny[1].values()]
        .filter(([head]) => head === vertex)
        .map(
            ([, tail]) =>
                [tail, args.sizes.get(tail) ?? 0, args.verticesToNodeUUIDs.get(tail)] as [number, number, UUID],
        )
        .sort(([, aSize, aUUID], [, bSize, bUUID]) => aSize - bSize || compareStrings(aUUID, bUUID))
        .forEach(([vertex]) => processClade(args, vertex, depth + 1))
}
const processCladeSizes = (sizes: Map<number, number>, phylogeny: Digraph, vertex: number): number => {
    const arcs = [...phylogeny[1].values()].filter(([head]) => head === vertex)
    const size = arcs
        .map(([, tail]) => processCladeSizes(sizes, phylogeny, tail))
        .reduce<number>((prev, childSize) => prev + childSize, 1)
    sizes.set(vertex, size)
    return size
}
const getPhylogenyDerivedData = (
    args: Pick<SourceData, "nodeUUIDsToVertices" | "phylogeny" | "source" | "verticesToNodeUUIDs">,
): Pick<SourceData, "depths" | "sortIndices"> => {
    const depths = new Map<UUID, number>()
    const sortIndices = new Map<UUID, number>()
    const rootVertex = args.nodeUUIDsToVertices.get(args.source.root)
    if (typeof rootVertex !== "number") {
        throw new Error("No vertex for root UUID.")
    }
    const sizes = new Map<number, number>()
    processCladeSizes(sizes, args.phylogeny, rootVertex)
    processClade({ ...args, depths, sizes, sortIndices, sortIndex: 0 }, rootVertex, 0)
    return { depths, sortIndices }
}
const loadExternalObjectIDs = (
    externals: Map<string, TitledLink>,
    authority: string,
    namespace: string,
    objectIDs: readonly string[],
    objectPromises: Promise<void>[],
) => {
    for (const objectID of objectIDs) {
        objectPromises.push(
            (async () => {
                const link = await readJSON<TitledLink>(
                    `.s3/source.phylopic.org/externals/${authority}/${namespace}/${objectID}/meta.json`,
                )
                externals.set(`${authority}/${namespace}/${objectID}`, link)
            })(),
        )
    }
}
const loadExternalNamespaces = async (
    externals: Map<string, TitledLink>,
    authority: string,
    namespaces: readonly string[],
    objectPromises: Promise<void>[],
): Promise<void> => {
    await Promise.all(
        namespaces.map(async namespace => {
            const objectIDs = await listDir(`.s3/source.phylopic.org/externals/${authority}/${namespace}`)
            loadExternalObjectIDs(externals, authority, namespace, objectIDs, objectPromises)
        }),
    )
}
const loadExternalAuthorities = async (
    externals: Map<string, TitledLink>,
    authorities: readonly string[],
    objectPromises: Promise<void>[],
): Promise<void> => {
    await Promise.all(
        authorities.map(async authority => {
            const namespaces = await listDir(`.s3/source.phylopic.org/externals/${authority}/`)
            await loadExternalNamespaces(externals, authority, namespaces, objectPromises)
        }),
    )
}
const loadExternals = async (externals: Map<string, TitledLink>): Promise<void> => {
    console.info("Looking up externals...")
    const objectPromises: Promise<void>[] = []
    const authorities = await listDir(".s3/source.phylopic.org/externals/")
    await loadExternalAuthorities(externals, authorities, objectPromises)
    console.info(`Loading ${objectPromises.length} externals...`)
    await Promise.all(objectPromises)
    console.info(`Loaded ${objectPromises.length} externals.`)
}
const getSourceData = async (args: Args): Promise<SourceData> => {
    const contributors = new Map<UUID, Contributor>()
    const externals = new Map<string, TitledLink>()
    const images = new Map<UUID, Image>()
    const nodes = new Map<UUID, Node>()
    const [source] = await Promise.all([
        loadSource(),
        loadContributors({ ...args, contributors }),
        loadNodes({ ...args, nodes }),
        loadImages({ ...args, images }),
        loadExternals(externals),
    ])
    const { nodeUUIDsToVertices, phylogeny, verticesToNodeUUIDs } = getPhylogeny({
        source,
        nodes,
    })
    return {
        build: args.build,
        contributors,
        externals,
        illustration: getIllustration({
            images,
            nodes,
        }),
        images,
        source,
        nodeUUIDsToVertices,
        nodes,
        phylogeny,
        verticesToNodeUUIDs,
        ...getPhylogenyDerivedData({ source, nodeUUIDsToVertices, phylogeny, verticesToNodeUUIDs }),
    }
}
export default getSourceData
