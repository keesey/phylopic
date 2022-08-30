import { TitledLink } from "@phylopic/api-models"
import BaseSourceClient, { ClientProvider, Page, SourceClient as ISourceClient } from "@phylopic/source-client"
import { Contributor, External, Image, isContributor, isExternal, isImage, isNode, Node } from "@phylopic/source-models"
import { Authority, compareStrings, isAuthority, isNamespace, Namespace, ObjectID, UUID } from "@phylopic/utils"
import { Arc, Digraph, sources } from "simple-digraph"
import getPhylogeny from "../models/getPhylogeny.js"
export type SourceData = Readonly<{
    build: number
    cladeImages: ReadonlyMap<UUID, ReadonlySet<UUID>>
    contributors: ReadonlyMap<UUID, Contributor>
    depths: ReadonlyMap<UUID, number>
    externals: ReadonlyMap<string, TitledLink>
    illustration: ReadonlyMap<UUID, readonly UUID[]>
    images: ReadonlyMap<UUID, Image>
    nodeUUIDsToVertices: ReadonlyMap<UUID, number>
    nodes: ReadonlyMap<UUID, Node>
    phylogeny: Digraph
    sortIndices: ReadonlyMap<UUID, number>
    verticesToNodeUUIDs: ReadonlyMap<number, UUID>
}>
export type Args = Readonly<{
    build: number
}>
type ProcessArgs = Args &
    Readonly<{
        client: ISourceClient
        contributors: Map<UUID, Contributor>
        depths: Map<UUID, number>
        externals: Map<string, TitledLink>
        illustration: Map<UUID, Set<UUID>>
        images: Map<UUID, Image>
        nodeUUIDsToVertices: Map<UUID, number>
        nodes: Map<UUID, Node>
        phylogenyArcs: Array<Arc>
        sortIndices: Map<UUID, number>
        verticesToNodeUUIDs: Map<number, UUID>
    }>
const loadExternalObjects = async (
    authority: Authority,
    namespace: Namespace,
    args: Pick<ProcessArgs, "client" | "externals">,
): Promise<void> => {
    console.info(`Looking up external objects for ${authority}/${namespace}...`)
    const total = await args.client.externals(authority, namespace).totalItems()
    console.info(`Loading ${total} external objects for ${authority}/${namespace}...`)
    let pageIndex: number | undefined = 0
    do {
        const page: Page<External & { authority: Authority; namespace: Namespace; objectID: ObjectID }, number> =
            await args.client.externals(authority, namespace).page(pageIndex)
        for (const item of page.items) {
            if (!isExternal(item as unknown)) {
                throw new Error(`Invalid external object ("${authority}/${namespace}/${item}").`)
            }
            args.externals.set([authority, namespace, item.objectID].map(x => encodeURIComponent(x)).join("/"), {
                href: `/nodes/${item.node}`,
                title: item.title,
            })
        }
        pageIndex = page.next
    } while (pageIndex !== undefined)
    console.info(`Loaded ${total} external objects for ${authority}/${namespace}.`)
}
const loadExternalNamespaces = async (
    authority: Authority,
    args: Pick<ProcessArgs, "client" | "externals">,
): Promise<void> => {
    console.info(`Looking up external namespaces for ${authority}...`)
    const total = await args.client.externalNamespaces(authority).totalItems()
    console.info(`Loading ${total} external namespace${total === 1 ? "" : "s"} for ${authority}...`)
    let pageIndex: number | undefined = 0
    do {
        const page: Page<Namespace, number> = await args.client.externalNamespaces(authority).page(pageIndex)
        for (const item of page.items) {
            if (!isNamespace(item as unknown)) {
                throw new Error(`Invalid external namespace ("${authority}/${item}").`)
            }
            await loadExternalObjects(authority, item, args)
        }
        pageIndex = page.next
    } while (pageIndex !== undefined)
    console.info(`Loaded ${total} external namespace${total === 1 ? "" : "s"} for ${authority}.`)
}
const loadExternals = async (args: Pick<ProcessArgs, "client" | "externals">): Promise<void> => {
    console.info("Looking up externals...")
    const total = await args.client.externalAuthorities.totalItems()
    console.info(`Loading ${total} external authorities...`)
    let pageIndex: number | undefined = 0
    do {
        const page: Page<Authority, number> = await args.client.externalAuthorities.page(pageIndex)
        for (const item of page.items) {
            if (!isAuthority(item as unknown)) {
                throw new Error(`Invalid external authority ("${item}").`)
            }
            await loadExternalNamespaces(item, args)
        }
        pageIndex = page.next
    } while (pageIndex !== undefined)
    console.info(`Loaded ${total} external authorities.`)
    console.info(`Loaded ${args.externals.size} externals.`)
}
const loadImages = async (args: Pick<ProcessArgs, "client" | "images">): Promise<void> => {
    console.info("Looking up accepted images...")
    const total = await args.client.images.accepted.totalItems()
    console.info(`Loading ${total} accepted images...`)
    let pageIndex: number | undefined = 0
    do {
        const page: Page<Image & { uuid: UUID }, number> = await args.client.images.accepted.page(pageIndex)
        for (const item of page.items) {
            if (!isImage(item as unknown)) {
                throw new Error(`Invalid image (UUID: "${item.uuid}").`)
            }
            args.images.set(item.uuid, item)
        }
        pageIndex = page.next
    } while (pageIndex !== undefined)
    console.info(`Loaded ${args.images.size} accepted images.`)
}
const loadNodes = async (args: Pick<ProcessArgs, "client" | "nodes">): Promise<void> => {
    console.info("Looking up nodes...")
    const total = await args.client.nodes.totalItems()
    console.info(`Loading ${total} nodes...`)
    let pageIndex: number | undefined = 0
    do {
        const page: Page<Node & { uuid: UUID }, number> = await args.client.nodes.page(pageIndex)
        for (const item of page.items) {
            if (!isNode(item as unknown)) {
                throw new Error(`Invalid node (UUID: "${item.uuid}").`)
            }
            args.nodes.set(item.uuid, item)
        }
        pageIndex = page.next
    } while (pageIndex !== undefined)
    console.info(`Loaded ${args.nodes.size} nodes.`)
}
const loadContributors = async (args: Pick<ProcessArgs, "client" | "contributors">): Promise<void> => {
    console.info("Looking up contributors...")
    const total = await args.client.contributors.totalItems()
    console.info(`Loading ${total} contributors...`)
    let pageIndex: number | undefined = 0
    do {
        const page: Page<Contributor & { uuid: UUID }, number> = await args.client.contributors.page(pageIndex)
        for (const item of page.items) {
            if (!isContributor(item as unknown)) {
                throw new Error(`Invalid contributor (UUID: "${item.uuid}").`)
            }
            args.contributors.set(item.uuid, item)
        }
        pageIndex = page.next
    } while (pageIndex !== undefined)
    console.info(`Loaded ${args.contributors.size} contributors.`)
}
const getNodeUUIDsInLineage = (
    args: Pick<SourceData, "nodes">,
    imageUUID: UUID,
    specific: UUID,
    general: UUID | null,
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
const getImageNodeDerivedData = (
    args: Pick<SourceData, "images" | "nodes">,
): Pick<SourceData, "cladeImages" | "illustration"> => {
    const cladeImages = new Map<UUID, Set<UUID>>()
    const illustration = new Map<UUID, readonly UUID[]>()
    for (const nodeUUID of args.nodes.keys()) {
        cladeImages.set(nodeUUID, new Set<UUID>())
    }
    const addImageToClades = (imageUUID: UUID, nodeUUID: UUID) => {
        cladeImages.get(nodeUUID)?.add(imageUUID)
        const node = args.nodes.get(nodeUUID)
        if (node?.parent) {
            addImageToClades(imageUUID, node.parent)
        }
    }
    for (const [uuid, image] of args.images.entries()) {
        const { general, specific } = image
        if (!specific || !args.nodes.has(specific)) {
            throw new Error(`Invalid specific node for image <${uuid}>: <${specific}>.`)
        }
        if (general && !args.nodes.has(general)) {
            throw new Error(`Invalid general node for image <${uuid}>: <${general}>.`)
        }
        const lineage = getNodeUUIDsInLineage(args, uuid, specific, general)
        illustration.set(uuid, lineage)
        addImageToClades(uuid, specific)
    }
    return { cladeImages, illustration }
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
    args: Pick<SourceData, "nodeUUIDsToVertices" | "phylogeny" | "verticesToNodeUUIDs">,
): Pick<SourceData, "depths" | "sortIndices"> => {
    const depths = new Map<UUID, number>()
    const sortIndices = new Map<UUID, number>()
    const roots = sources(args.phylogeny)
    if (roots.size !== 1) {
        throw new Error("No vertex for root UUID.")
    }
    const rootVertex = Array.from(roots)[0]
    const sizes = new Map<number, number>()
    processCladeSizes(sizes, args.phylogeny, rootVertex)
    processClade({ ...args, depths, sizes, sortIndices, sortIndex: 0 }, rootVertex, 0)
    return { depths, sortIndices }
}
class SourceClient extends BaseSourceClient {
    constructor() {
        const provider = new ClientProvider(
            {
                database: "phylopic-source",
                host: process.env.PGHOST,
                password: process.env.PGPASSWORD,
                port: parseInt(process.env.PGPORT!, 10),
                user: process.env.PGUSER,
            },
            {
                credentials: {
                    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
                    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
                },
                region: process.env.S3_REGION!,
            },
        )
        super(provider)
        this.destroy = () => provider.destroy()
    }
    public readonly destroy: () => Promise<void>
}
const getSourceData = async (args: Args): Promise<SourceData> => {
    const client = new SourceClient()
    let result: SourceData
    try {
        const contributors = new Map<UUID, Contributor>()
        const externals = new Map<string, TitledLink>()
        const images = new Map<UUID, Image>()
        const nodes = new Map<UUID, Node>()
        await Promise.all([
            loadContributors({ client, contributors }),
            loadNodes({ client, nodes }),
            loadImages({ client, images }),
            loadExternals({ client, externals }),
        ])
        const { nodeUUIDsToVertices, phylogeny, verticesToNodeUUIDs } = getPhylogeny({
            nodes,
        })
        result = {
            build: args.build,
            contributors,
            externals,
            images,
            nodeUUIDsToVertices,
            nodes,
            phylogeny,
            verticesToNodeUUIDs,
            ...getImageNodeDerivedData({ images, nodes }),
            ...getPhylogenyDerivedData({ nodeUUIDsToVertices, phylogeny, verticesToNodeUUIDs }),
        }
    } finally {
        await client.destroy()
    }
    return result
}
export default getSourceData
