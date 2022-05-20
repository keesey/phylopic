import { CommonPrefix, ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3"
import { Entity, isNode, Node, SOURCE_BUCKET_NAME } from "@phylopic/source-models"
import { isUUID } from "@phylopic/utils"
import { getJSON } from "@phylopic/utils-aws"
import { GetServerSideProps, GetServerSidePropsResult, NextPage } from "next"
import Head from "next/head"
import Link from "next/link"
import React from "react"
import Breadcrumbs from "~/ui/Breadcrumbs"
import NameView from "~/views/NameView"

export interface Props {
    entities: readonly Partial<Entity<Node>>[]
    index: number
    lastPage?: boolean
}
const PAGE_SIZE = 50
const Page: NextPage<Props> = ({ entities, index, lastPage }) => (
    <>
        <Head>
            <title>PhyloPic Editor: Nodes</title>
        </Head>
        <main>
            <header>
                <Breadcrumbs items={[{ href: "/", children: "Home" }, { children: "Nodes" }]} />
                <h1>Nodes</h1>
            </header>
            <nav className="pagination">
                <ul>
                    {index > 0 && (
                        <li>
                            <Link href={`/nodes${index > 1 ? `?page=${index - 1}` : ""}`}>&larr; Previous Page</Link>
                        </li>
                    )}
                    <li>Page {index + 1}</li>
                    {!lastPage && (
                        <li>
                            <Link href={`/nodes?page=${index + 2}`}>Next Page &rarr;</Link>
                        </li>
                    )}
                </ul>
            </nav>
            <section>
                <ul>
                    {entities
                        .filter(entity => entity.uuid && entity.value)
                        .map(entity =>
                            entity.value ? (
                                <li key={entity.uuid}>
                                    <Link href={`/nodes/${entity.uuid}`}>
                                        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                        <a>
                                            <NameView name={entity.value.names[0]} />
                                        </a>
                                    </Link>
                                </li>
                            ) : null,
                        )}
                </ul>
            </section>
        </main>
    </>
)
export default Page
const getPageObjects = async (
    client: S3Client,
    index: number,
    token?: string,
): Promise<Readonly<[readonly CommonPrefix[], boolean]>> => {
    const command = new ListObjectsV2Command({
        Bucket: SOURCE_BUCKET_NAME,
        ContinuationToken: token,
        Delimiter: "/",
        Prefix: "nodes/",
        MaxKeys: PAGE_SIZE,
    })
    const result = await client.send(command)
    console.debug(result)
    if (!result.CommonPrefixes?.length) {
        return [[], true]
    }
    if (!index) {
        return [result.CommonPrefixes ?? [], !result.NextContinuationToken]
    }
    if (!result.NextContinuationToken) {
        return [[], true]
    }
    return getPageObjects(client, index - 1, result.NextContinuationToken)
}
const getUUIDFromPrefix = (prefix: string | undefined) => prefix?.match(/^nodes\/([^/]+)/)?.[1]
const getEntities = async (
    client: S3Client,
    index: number,
): Promise<Readonly<[readonly Partial<Entity<Node>>[], boolean]>> => {
    const [objects, lastPage] = await getPageObjects(client, index)
    const promises = objects.map(async (object): Promise<Partial<Entity<Node>>> => {
        const uuid = getUUIDFromPrefix(object.Prefix)
        if (!isUUID(uuid)) {
            throw new Error(`Not a UUID: <${uuid}>.`)
        }
        const [node] = await getJSON<Node>(
            client,
            {
                Bucket: SOURCE_BUCKET_NAME,
                Key: `nodes/${uuid}/meta.json`,
            },
            isNode,
        )
        return {
            uuid,
            value: node,
        }
    })
    return [await Promise.all(promises), lastPage]
}
export const getServerSideProps: GetServerSideProps<Props> = async ({ query }) => {
    const page = typeof query.page === "string" ? parseInt(query.page, 10) : 1
    const index = isNaN(page) ? 0 : Math.max(0, page - 1)
    let result: GetServerSidePropsResult<Props>
    const client = new S3Client({})
    try {
        const [entities, lastPage] = await getEntities(client, index)
        if (!entities.length && index > 0) {
            result = { notFound: true }
        } else {
            result = {
                props: {
                    entities,
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
