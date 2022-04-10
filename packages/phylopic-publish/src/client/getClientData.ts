import { ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3"
import {
    Image,
    Main,
    Node,
    normalizeUUID,
    UUID,
    validateImage,
    validateMain,
    validateNode,
    validateUUID,
} from "phylopic-source-models/src"
import getJSON from "../s3utils/getJSON"
export type ClientData = Readonly<{
    externals: ReadonlyMap<string, Readonly<{ uuid: UUID; title: string }>>
    imageFileKeys: ReadonlyMap<UUID, string>
    images: ReadonlyMap<UUID, Image>
    main: Main
    nodes: ReadonlyMap<UUID, Node>
}>
const getMain = async (client: S3Client): Promise<Main> => {
    const [main] = await getJSON<Main>(
        client,
        {
            Bucket: "source.phylopic.org",
            Key: "meta.json",
        },
        validateMain,
    )
    return main
}
const getEntities = async <T>(
    client: S3Client,
    name: string,
    validator: (value: T) => void,
): Promise<ReadonlyMap<UUID, T>> => {
    const result = new Map<UUID, T>()
    let ContinuationToken: string | undefined
    const promises: Promise<void>[] = []
    do {
        const listResult = await client.send(
            new ListObjectsV2Command({
                Bucket: "source.phylopic.org",
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
                            const [value] = await getJSON<T>(client, {
                                Bucket: "source.phylopic.org",
                                Key: `${name}/${uuid}/meta.json`,
                            })
                            validator(value)
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
    const result = new Map<string, Readonly<{ uuid: UUID; title: string }>>()
    let ContinuationToken: string | undefined
    const promises: Promise<void>[] = []
    do {
        const listResult = await client.send(
            new ListObjectsV2Command({
                Bucket: "source.phylopic.org",
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
                            const [{ href, title }] = await getJSON<{ href: string; title: string }>(client, {
                                Bucket: "source.phylopic.org",
                                Key: object.Key,
                            })
                            const uuid = href?.replace(/^\/nodes\//, "")
                            validateUUID(uuid, true)
                            result.set(parts.join("/"), { uuid, title })
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
                    Bucket: "source.phylopic.org",
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
const getClientData = async (client: S3Client): Promise<ClientData> => {
    const [externals, images, main, nodes] = await Promise.all([
        getExternals(client),
        getEntities<Image>(client, "images", validateImage),
        getMain(client),
        getEntities<Node>(client, "nodes", validateNode),
    ])
    const imageFileKeys = await getImageFileKeys(client, [...images.keys()])
    return {
        externals,
        imageFileKeys,
        images,
        main,
        nodes,
    }
}
export default getClientData
