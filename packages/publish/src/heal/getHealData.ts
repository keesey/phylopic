import { ListObjectsV2Command, S3Client, _Object } from "@aws-sdk/client-s3"
import { isTitledLink, TitledLink } from "@phylopic/api-models"
import { Contributor, Image, isSource, Node, Source, SOURCE_BUCKET_NAME } from "@phylopic/source-models"
import { extractPath, isString, isUUID, normalizeUUID, UUID } from "@phylopic/utils"
import { getJSON } from "@phylopic/utils-aws"
import { Digraph } from "simple-digraph"
import getPhylogeny from "../models/getPhylogeny.js"
const SOURCE_FILE_EXTENSIONS = ["svg", "png", "tif", "bmp", "gif", "jpg"]
export type HealData = Readonly<{
    contributors: ReadonlyMap<UUID, Contributor>
    contributorsToPut: ReadonlySet<UUID>
    externals: ReadonlyMap<string, TitledLink>
    externalsToPut: ReadonlySet<string>
    imageFileKeys: ReadonlyMap<UUID, string>
    images: ReadonlyMap<UUID, Image>
    imagesToPut: ReadonlySet<UUID>
    keysToDelete: ReadonlySet<string>
    nodeUUIDsToVertices: ReadonlyMap<UUID, number>
    nodes: Map<UUID, Node>
    nodesToPut: ReadonlySet<UUID>
    phylogeny: Digraph
    source: Source
    verticesToNodeUUIDs: ReadonlyMap<number, UUID>
}>
type BucketResult = {
    contributors: Map<UUID, Contributor>
    contributorsToPut: Set<UUID>
    externals: Map<string, TitledLink>
    externalsToPut: Set<string>
    imageFileKeys: Map<UUID, string>
    images: Map<UUID, Image>
    imagesToPut: Set<UUID>
    keysToDelete: Set<string>
    source: Source | undefined
    nodes: Map<UUID, Node>
    nodesToPut: Set<UUID>
}
const readMain = async (client: S3Client, result: Pick<BucketResult, "source">): Promise<void> => {
    ;[result.source] = await getJSON<Source>(
        client,
        {
            Bucket: SOURCE_BUCKET_NAME,
            Key: "meta.json",
        },
        isSource,
    )
}
const readImageMeta = async (
    client: S3Client,
    result: Pick<BucketResult, "images" | "keysToDelete">,
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
        Bucket: SOURCE_BUCKET_NAME,
        Key,
    })
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
const readContributorMeta = async (
    client: S3Client,
    result: Pick<BucketResult, "contributors" | "keysToDelete">,
    uuid: UUID,
): Promise<void> => {
    const Key = `contributors/${uuid}/meta.json`
    if (!isUUID(uuid)) {
        console.warn(`Invalid contributors metadata UUID: <${uuid}>.`)
        result.keysToDelete.add(Key)
        return
    }
    if (uuid !== normalizeUUID(uuid)) {
        console.warn(`Contributors metadata UUID is not normalized and will be deleted: <${uuid}>.`)
        result.keysToDelete.add(Key)
        return
    }
    const [contributor] = await getJSON<Contributor>(client, {
        Bucket: SOURCE_BUCKET_NAME,
        Key,
    })
    result.contributors.set(uuid, contributor)
}
const readNodeMeta = async (
    client: S3Client,
    result: Pick<BucketResult, "keysToDelete" | "nodes">,
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
        Bucket: SOURCE_BUCKET_NAME,
        Key,
    })
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
        Bucket: SOURCE_BUCKET_NAME,
        Key: `externals/${path}/meta.json`,
    }, isTitledLink(isString))
    result.externals.set(path, link)
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
    match = object.Key?.match(/^contributors\/([^/]+)\/meta.json$/)
    if (match) {
        return readContributorMeta(client, result, match[1])
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
            Bucket: SOURCE_BUCKET_NAME,
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
    const { source } = data
    if (!source) {
        throw new Error("Cannot read phylogeny without source metadata.")
    }
    return getPhylogeny(
        { ...data, source },
        {
            handleOrphan: (uuid, node) => {
                data.nodes.set(uuid, {
                    ...node,
                    parent: source.root,
                })
                data.nodesToPut.add(uuid)
            },
            handleParentedRoot: (uuid, node) => {
                data.nodes.set(uuid, {
                    created: node.created,
                    names: node.names,
                    parent: null,
                })
                data.nodesToPut.add(uuid)
            },
        },
    )
}
// :TODO: Add externals
const getHealData = async (client: S3Client): Promise<HealData> => {
    const bucketResult: BucketResult = {
        contributors: new Map<UUID, Contributor>(),
        contributorsToPut: new Set<UUID>(),
        externals: new Map<string, TitledLink>(),
        externalsToPut: new Set<string>(),
        imageFileKeys: new Map<UUID, string>(),
        images: new Map<UUID, Image>(),
        imagesToPut: new Set<UUID>(),
        keysToDelete: new Set<string>(),
        nodes: new Map<UUID, Node>(),
        nodesToPut: new Set<UUID>(),
        source: undefined as Source | undefined,
    }
    await readFromBucket(client, bucketResult)
    const { source } = bucketResult
    if (!source) {
        throw new Error("Source metadata is missing!")
    }
    return {
        ...bucketResult,
        ...getPhylogenyResult(bucketResult),
        source,
    }
}
export default getHealData
