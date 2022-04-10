import { ListObjectsV2Command, S3Client, _Object } from "@aws-sdk/client-s3"
import { TitledLink } from "phylopic-api-models/src"
import {
    Image,
    isUUID,
    Main,
    Node,
    normalizeNames,
    normalizeText,
    normalizeUUID,
    UUID,
    validateImage,
    validateMain,
    validateNode,
} from "phylopic-source-models/src"
import { Digraph } from "simple-digraph"
import getPhylogeny from "../phylopic/getPhylogeny"
import getJSON from "../s3utils/getJSON"
const SOURCE_FILE_EXTENSIONS = ["svg", "png", "tif", "bmp", "gif", "jpg"]
export type HealData = Readonly<{
    externals: ReadonlyMap<string, Readonly<{ uuid: UUID; title: string }>>
    externalsToPut: ReadonlySet<string>
    imageFileKeys: ReadonlyMap<UUID, string>
    images: ReadonlyMap<UUID, Image>
    imagesToPut: ReadonlySet<UUID>
    keysToDelete: ReadonlySet<string>
    main: Main
    nodeUUIDsToVertices: ReadonlyMap<UUID, number>
    nodes: Map<UUID, Node>
    nodesToPut: ReadonlySet<UUID>
    phylogeny: Digraph
    verticesToNodeUUIDs: ReadonlyMap<number, UUID>
}>
type BucketResult = {
    externals: Map<string, Readonly<{ uuid: UUID; title: string }>>
    externalsToPut: Set<string>
    imageFileKeys: Map<UUID, string>
    images: Map<UUID, Image>
    imagesToPut: Set<UUID>
    keysToDelete: Set<string>
    main: Main | undefined
    nodes: Map<UUID, Node>
    nodesToPut: Set<UUID>
}
const readMain = async (client: S3Client, result: Pick<BucketResult, "main">): Promise<void> => {
    ;[result.main] = await getJSON<Main>(client, {
        Bucket: "source.phylopic.org",
        Key: "meta.json",
    })
    validateMain(result.main)
}
const readImageMeta = async (
    client: S3Client,
    result: Pick<BucketResult, "images" | "imagesToPut" | "keysToDelete">,
    uuid: UUID,
): Promise<void> => {
    const Key = `images/${uuid}/meta.json`
    if (!isUUID(uuid)) {
        console.warn(`Invalid image metadata UUID: <${uuid}>.`)
        result.keysToDelete.add(Key)
        return
    }
    if (uuid !== normalizeUUID(uuid)) {
        console.warn(`Image metadata UUID is not normalized and will be deleted: <${uuid}>.`)
        result.keysToDelete.add(Key)
        return
    }
    const [image] = await getJSON<Image>(client, {
        Bucket: "source.phylopic.org",
        Key,
    })
    try {
        validateImage(image)
    } catch (e) {
        console.warn(`Could not validate image metadata: ${uuid}`)
        result.keysToDelete.add(Key)
        return
    }
    try {
        validateImage(image, true)
    } catch (e) {
        console.info(`Normalizing image: ${uuid}`)
        const normalizedImage: Image = {
            created: image.created,
            attribution: image.attribution ? normalizeText(image.attribution) : undefined,
            contributor: normalizeText(image.contributor),
            general: image.general ? normalizeUUID(image.general) : undefined,
            license: image.license,
            specific: normalizeUUID(image.specific),
            sponsor: image.sponsor ? normalizeText(image.sponsor) : undefined,
        }
        result.images.set(uuid, normalizedImage)
        result.imagesToPut.add(uuid)
        return
    }
    result.images.set(uuid, image)
}
const readImageSource = async (
    result: Pick<BucketResult, "imageFileKeys" | "keysToDelete">,
    uuid: UUID,
    extension: string,
): Promise<void> => {
    const Key = `images/${uuid}/source.${extension}`
    if (!isUUID(uuid)) {
        console.warn(`Invalid image source file UUID: <${uuid}>.`)
        result.keysToDelete.add(Key)
        return
    }
    if (uuid !== normalizeUUID(uuid)) {
        console.warn(`Image source file UUID is not normalized and will be deleted: <${uuid}>.`)
        result.keysToDelete.add(Key)
        return
    }
    const existingKey = result.imageFileKeys.get(uuid)
    if (existingKey) {
        const existingExtension = existingKey.split(".", 2)[1]
        const existingExtensionIndex = SOURCE_FILE_EXTENSIONS.indexOf(existingExtension)
        const extensionIndex = SOURCE_FILE_EXTENSIONS.indexOf(extension)
        const keyToDelete = extensionIndex < existingExtensionIndex ? existingKey : Key
        console.warn(`Two or more source files for image: <${uuid}>.\n\tMarking <${keyToDelete}> for deletion.`)
        result.keysToDelete.add(keyToDelete)
        result.imageFileKeys.set(uuid, extensionIndex < existingExtensionIndex ? Key : existingKey)
        return
    }
    // :TODO: Validate image file?
    result.imageFileKeys.set(uuid, Key)
}
const readNodeMeta = async (
    client: S3Client,
    result: Pick<BucketResult, "keysToDelete" | "nodes" | "nodesToPut">,
    uuid: UUID,
): Promise<void> => {
    const Key = `nodes/${uuid}/meta.json`
    if (!isUUID(uuid)) {
        console.warn(`Invalid nodes metadata UUID: <${uuid}>.`)
        result.keysToDelete.add(Key)
        return
    }
    if (uuid !== normalizeUUID(uuid)) {
        console.warn(`Node metadata UUID is not normalized and will be deleted: <${uuid}>.`)
        result.keysToDelete.add(Key)
        return
    }
    const [node] = await getJSON<Node>(client, {
        Bucket: "source.phylopic.org",
        Key,
    })
    try {
        validateNode(node)
    } catch (e) {
        console.warn(`Deleting invalid node metadata: <${uuid}>. (${e})`)
        result.keysToDelete.add(Key)
        return
    }
    try {
        validateNode(node, true)
    } catch (e) {
        console.warn(`Normalizing node: ${uuid}`)
        const normalizedNode: Node = {
            created: node.created,
            names: normalizeNames(node.names),
            parent: node.parent ? normalizeUUID(node.parent) : undefined,
        }
        result.nodes.set(uuid, normalizedNode)
        result.nodesToPut.add(uuid)
        return
    }
    result.nodes.set(uuid, node)
}
const readExternal = async (
    client: S3Client,
    result: BucketResult,
    authority: string,
    namespace: string,
    objectId: string,
) => {
    const path = `${encodeURIComponent(authority)}/${encodeURIComponent(namespace)}/${encodeURIComponent(objectId)}`
    const [link] = await getJSON<TitledLink>(client, {
        Bucket: "source.phylopic.org",
        Key: `externals/${path}/meta.json`,
    })
    result.externals.set(path, { uuid: link.href?.replace(/^\/nodes\//, ""), title: link.title })
}
const addToResult = async (client: S3Client, result: BucketResult, object: _Object): Promise<void> => {
    if (!object.Key) {
        return
    }
    if (object.Key === "meta.json") {
        return readMain(client, result)
    }
    let match = object.Key?.match(/^images\/([^/]+)\/meta.json$/)
    if (match) {
        return readImageMeta(client, result, match[1])
    }
    match = object.Key?.match(/^images\/([^/]+)\/source\.(svg|png|bmp|gif|jpg)$/)
    if (match) {
        return readImageSource(result, match[1], match[2])
    }
    match = object.Key?.match(/^nodes\/([^/]+)\/meta.json$/)
    if (match) {
        return readNodeMeta(client, result, match[1])
    }
    match = object.Key?.match(/^externals\/([^/]+)\/([^/]+)\/([^/]+)\/meta.json$/)
    if (match) {
        return readExternal(
            client,
            result,
            decodeURIComponent(match[1]),
            decodeURIComponent(match[2]),
            decodeURIComponent(match[3]),
        )
    }
    console.warn(`Extraneous file found: ${object.Key}`)
    result.keysToDelete.add(object.Key)
}
const readFromBucket = async (client: S3Client, result: BucketResult, ContinuationToken?: string): Promise<void> => {
    const listResult = await client.send(
        new ListObjectsV2Command({
            Bucket: "source.phylopic.org",
            ContinuationToken,
        }),
    )
    const promises = listResult.Contents?.map(object => addToResult(client, result, object)) ?? []
    if (listResult.NextContinuationToken) {
        promises.push(readFromBucket(client, result, listResult.NextContinuationToken))
    }
    await Promise.all(promises)
}
const getPhylogenyResult = (data: BucketResult) => {
    const { main } = data
    if (!main) {
        throw new Error("Cannot read phylogeny without main metadata.")
    }
    return getPhylogeny(
        { ...data, main },
        {
            handleOrphan: (uuid, node) => {
                data.nodes.set(uuid, {
                    ...node,
                    parent: main.root,
                })
                data.nodesToPut.add(uuid)
            },
            handleParentedRoot: (uuid, node) => {
                data.nodes.set(uuid, {
                    created: node.created,
                    names: node.names,
                })
                data.nodesToPut.add(uuid)
            },
        },
    )
}
// :TODO: Add externals
const getHealData = async (client: S3Client): Promise<HealData> => {
    const bucketResult: BucketResult = {
        externals: new Map<string, Readonly<{ uuid: UUID; title: string }>>(),
        externalsToPut: new Set<string>(),
        imageFileKeys: new Map<UUID, string>(),
        images: new Map<UUID, Image>(),
        imagesToPut: new Set<UUID>(),
        keysToDelete: new Set<string>(),
        main: undefined as Main | undefined,
        nodes: new Map<UUID, Node>(),
        nodesToPut: new Set<UUID>(),
    }
    await readFromBucket(client, bucketResult)
    const { main } = bucketResult
    if (!main) {
        throw new Error("Main metadata is missing!")
    }
    return {
        ...bucketResult,
        ...getPhylogenyResult(bucketResult),
        main,
    }
}
export default getHealData
