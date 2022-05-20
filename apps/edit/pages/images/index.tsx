import { ListObjectsV2Command, ListObjectsV2CommandOutput, S3Client, _Object } from "@aws-sdk/client-s3"
import { Entity, Image, isImage, isNode, Node, SOURCE_BUCKET_NAME } from "@phylopic/source-models"
import { getJSON } from "@phylopic/utils-aws"
import { GetServerSideProps, GetServerSidePropsResult, NextPage } from "next"
import Head from "next/head"
import Link from "next/link"
import React from "react"
import Breadcrumbs from "~/ui/Breadcrumbs"
import NameView from "~/views/NameView"

export type Entry = {
    readonly image: Partial<Entity<Image>>
    readonly node: Partial<Entity<Node>>
}
export interface Props {
    entries: readonly Entry[]
    index: number
    lastPage?: boolean
}
const PAGE_SIZE = 25
const Page: NextPage<Props> = ({ entries, index, lastPage }) => (
    <>
        <Head>
            <title>PhyloPic Editor: Images</title>
        </Head>
        <main>
            <header>
                <Breadcrumbs items={[{ href: "/", children: "Home" }, { children: "Images" }]} />
                <h1>Images</h1>
            </header>
            <nav>
                <ul>
                    {index > 0 && (
                        <li>
                            <Link href={`/images?page=${index}`}>&larr; Previous Page</Link>
                        </li>
                    )}
                    <li>Page {index + 1}</li>
                    {!lastPage && (
                        <li>
                            <Link href={`/images?page=${index + 2}`}>Next Page &rarr;</Link>
                        </li>
                    )}
                </ul>
            </nav>
            <section>
                <ul>
                    {entries.map(entry => (
                        <li key={entry.image.uuid}>
                            <Link href={`/images/${entry.image.uuid}`}>
                                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                <a>
                                    {entry.node.value?.names?.[0] ? (
                                        <NameView name={entry.node.value.names[0]} short />
                                    ) : (
                                        "Image"
                                    )}
                                    {" by "}
                                    {entry.image.value?.attribution ?? "Anonymous"}
                                </a>
                            </Link>
                        </li>
                    ))}
                </ul>
            </section>
        </main>
    </>
)
export default Page
const getPageObjects = async (index: number, token?: string): Promise<Readonly<[readonly _Object[], boolean]>> => {
    const command = new ListObjectsV2Command({
        Bucket: SOURCE_BUCKET_NAME,
        ContinuationToken: token,
        Prefix: "images/",
        MaxKeys: PAGE_SIZE * 2,
    })
    const client = new S3Client({})
    let result: ListObjectsV2CommandOutput
    try {
        result = await client.send(command)
    } finally {
        client.destroy()
    }
    if (!result.KeyCount) {
        return [[], true]
    }
    if (!index) {
        return [result.Contents ?? [], !result.NextContinuationToken]
    }
    if (!result.NextContinuationToken) {
        return [[], true]
    }
    return getPageObjects(index - 1, result.NextContinuationToken)
}
const getUUIDFromImageKey = (key: string | undefined) => key?.match(/^images\/([^/]+)/)?.[1]
const getEntries = async (client: S3Client, index: number): Promise<Readonly<[readonly Entry[], boolean]>> => {
    const [objects, lastPage] = await getPageObjects(index)
    const promises = objects
        .filter(object => object?.Key?.endsWith("meta.json"))
        .map(async (object): Promise<Entry> => {
            const [image] = await getJSON<Image>(
                client,
                {
                    Bucket: SOURCE_BUCKET_NAME,
                    Key: object.Key,
                },
                isImage,
            )
            const [node] = await getJSON<Node>(
                client,
                {
                    Bucket: SOURCE_BUCKET_NAME,
                    Key: `nodes/${image.specific}/meta.json`,
                },
                isNode,
            )
            return {
                image: {
                    uuid: getUUIDFromImageKey(object.Key),
                    value: image,
                },
                node: {
                    uuid: image.specific,
                    value: node,
                },
            }
        })
    return [await Promise.all(promises), lastPage]
}
export const getServerSideProps: GetServerSideProps<Props> = async ({ query }) => {
    const page = typeof query.page === "string" ? parseInt(query.page, 10) : 1
    const index = isNaN(page) ? 0 : Math.max(0, page - 1)
    const client: S3Client = new S3Client({})
    let result: GetServerSidePropsResult<Props>
    try {
        const [entries, lastPage] = await getEntries(client, index)
        if (!entries.length && index > 0) {
            result = { notFound: true }
        } else {
            result = {
                props: {
                    entries,
                    index,
                    lastPage,
                },
            }
        }
    } finally {
        client.destroy()
    }
    return result
}
