import { ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3"
import { isTitledLink, TitledLink } from "@phylopic/api-models"
import { Image, isImage, isNode, isSource, Node, Source, SOURCE_BUCKET_NAME } from "@phylopic/source-models"
import { FaultDetector, isString, isUUID, normalizeUUID, UUID } from "@phylopic/utils"
import { getJSON } from "@phylopic/utils-aws"
export type CLIData = Readonly<{
    externals: ReadonlyMap<string, TitledLink>
    imageFileKeys: ReadonlyMap<UUID, string>
    images: ReadonlyMap<UUID, Image>
    source: Source
    nodes: ReadonlyMap<UUID, Node>
}>
const getSource = async (client: S3Client): Promise<Source> => {
    const [main] = await getJSON<Source>(
        client,
        {
            Bucket: SOURCE_BUCKET_NAME,
            Key: "meta.json",
        },
        isSource,
    )
    return main
}
const getEntities = async <T>(
    client: S3Client,
    name: string,
    detector: FaultDetector<T>,
): Promise<ReadonlyMap<UUID, T>> => {
    const result = new Map<UUID, T>()
    let ContinuationToken: string | undefined
    const promises: Promise<void>[] = []
    do {
        const listResult = await client.send(
            new ListObjectsV2Command({
                Bucket: SOURCE_BUCKET_NAME,
                ContinuationToken,
                Delimiter: "/",
                Prefix: `${name}/`,
            }),
        )
        if (listResult.CommonPrefixes) {
            for (const prefix of listResult.CommonPrefixes) {
                if (prefix.Prefix) {
                    const uuid = normalizeUUID(prefix.Prefix.replace(`${name}/`, "").replace(/\/$/, ""))
                    promises.push(
                        (async () => {
                            const [value] = await getJSON<T>(
                                client,
                                {
                                    Bucket: SOURCE_BUCKET_NAME,
                                    Key: `${name}/${uuid}/meta.json`,
                                },
                                detector,
                            )
                            result.set(uuid, value)
                        })(),
                    )
                }
            }
        }
        ContinuationToken = listResult.NextContinuationToken
    } while (ContinuationToken)
    await Promise.all(promises)
    return result
}
const getExternals = async (client: S3Client) => {
    const result = new Map<string, TitledLink>()
    let ContinuationToken: string | undefined
    const promises: Promise<void>[] = []
    do {
        const listResult = await client.send(
            new ListObjectsV2Command({
                Bucket: SOURCE_BUCKET_NAME,
                ContinuationToken,
                Prefix: `externals/`,
            }),
        )
        if (listResult.Contents) {
            for (const object of listResult.Contents) {
                promises.push(
                    (async () => {
                        if (object.Key) {
                            const parts = object.Key.replace(/^externals\//, "")
                                .replace(/\/meta\.json$/, "")
                                .split("/")
                            if (parts.length !== 3) {
                                console.warn(`Unexpected external key: ${JSON.stringify(object.Key)}.`)
                            }
                            const [{ href, title }] = await getJSON<TitledLink>(
                                client,
                                {
                                    Bucket: SOURCE_BUCKET_NAME,
                                    Key: object.Key,
                                },
                                isTitledLink(isString),
                            )
                            const uuid = href?.replace(/^\/nodes\//, "")
                            if (!isUUID(uuid) || uuid !== normalizeUUID(uuid)) {
                                throw new Error(`Invalid UUID: ${uuid} (${SOURCE_BUCKET_NAME}//${object.Key})`)
                            }
                            result.set(parts.join("/"), { href: `/nodes/${uuid}`, title })
                        }
                    })(),
                )
            }
        }
        ContinuationToken = listResult.NextContinuationToken
    } while (ContinuationToken)
    await Promise.all(promises)
    return result
}
const getImageFileKeys = async (client: S3Client, uuids: readonly UUID[]): Promise<ReadonlyMap<UUID, string>> => {
    const entries = await Promise.all(
        uuids.map<Promise<[UUID, string]>>(async uuid => {
            const listResult = await client.send(
                new ListObjectsV2Command({
                    Bucket: SOURCE_BUCKET_NAME,
                    MaxKeys: 2,
                    Prefix: `images/${uuid}/source.`,
                }),
            )
            if (listResult.Contents?.length !== 1 || !listResult.Contents[0].Key) {
                throw new Error(`Cannot find source file for image: ${JSON.stringify(uuid)}.`)
            }
            return [uuid, listResult.Contents[0].Key]
        }),
    )
    return new Map(entries)
}
const getCLIData = async (client: S3Client): Promise<CLIData> => {
    const [externals, images, source, nodes] = await Promise.all([
        getExternals(client),
        getEntities<Image>(client, "images", isImage),
        getSource(client),
        getEntities<Node>(client, "nodes", isNode),
    ])
    const imageFileKeys = await getImageFileKeys(client, [...images.keys()])
    return {
        externals,
        imageFileKeys,
        images,
        source,
        nodes,
    }
}
export default getCLIData
