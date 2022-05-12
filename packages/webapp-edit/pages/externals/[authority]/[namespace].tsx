import { ListObjectsV2Command, ListObjectsV2CommandOutput, S3Client } from "@aws-sdk/client-s3"
import { SOURCE_BUCKET_NAME } from "@phylopic/source-models"
import { Authority, isAuthority, isNamespace, Namespace } from "@phylopic/utils"
import { getJSON } from "@phylopic/utils-aws"
import { GetServerSideProps, NextPage } from "next"
import Head from "next/head"
import Link from "next/link"
import React from "react"
import Breadcrumbs from "~/ui/Breadcrumbs"

export interface Props {
    authority: Authority
    namespace: Namespace
    pageToken: string | null
    references: readonly Readonly<{ href: string; objectId: string; title: string }>[]
}
const Page: NextPage<Props> = ({ authority, namespace, pageToken, references }) => (
    <>
        <Head>
            <title>
                PhyloPic Editor: Namespace {authority}:{namespace}
            </title>
        </Head>
        <main>
            <header>
                <Breadcrumbs
                    items={[
                        { href: "/", children: "Home" },
                        { href: "/externals", children: "External Namespaces" },
                        {
                            children: (
                                <code>
                                    {authority}:{namespace}
                                </code>
                            ),
                        },
                    ]}
                />
                <h1>
                    <code>
                        {authority}:{namespace}
                    </code>
                </h1>
            </header>
            <section>
                <ul>
                    {references.map(({ href, objectId, title }) => (
                        <li key={objectId}>
                            <Link href={href}>
                                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                <a>
                                    <code>{objectId}</code>: <span className="nomen">{title}</span>
                                </a>
                            </Link>
                        </li>
                    ))}
                </ul>
            </section>
            <nav className="pagination">
                {pageToken && (
                    <Link
                        as={`/externals/${encodeURIComponent(authority)}/${encodeURIComponent(
                            authority,
                        )}?pageToken=${encodeURIComponent(pageToken)}`}
                        href={`/externals/${encodeURIComponent(authority)}/${encodeURIComponent(authority)}`}
                    >
                        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                        <a>Next Page</a>
                    </Link>
                )}
                {!pageToken && "(No More Pages)"}
            </nav>
        </main>
    </>
)
export default Page
export const getServerSideProps: GetServerSideProps<Props> = async ({ query }) => {
    const ContinuationToken = typeof query.pageToken === "string" ? query.pageToken : undefined
    if (!isAuthority(query.authority) || !isNamespace(query.namespace)) {
        return { notFound: true }
    }
    if (query.authority === "phylopic.org") {
        return { redirect: { destination: "/nodes", permanent: true } }
    }
    const client = new S3Client({})
    let listResponse: ListObjectsV2CommandOutput
    let references: Props["references"]
    try {
        listResponse = await client.send(
            new ListObjectsV2Command({
                Bucket: SOURCE_BUCKET_NAME,
                ContinuationToken,
                Prefix: "externals/",
            }),
        )
        references = listResponse.Contents
            ? await Promise.all(
                  listResponse.Contents.map(async object => {
                      if (!object.Key) {
                          throw new Error("Invalid key.")
                      }
                      const [, , objectId] = object.Key.replace(/^externals\//, "")
                          .replace(/\/meta\.json$/, "")
                          .split("/")
                      const [{ href, title }] = await getJSON<{ href: string; title: string }>(client, {
                          Bucket: SOURCE_BUCKET_NAME,
                          Key: object.Key,
                      })
                      return { href, objectId, title }
                  }),
              )
            : []
    } finally {
        client.destroy()
    }
    return {
        props: {
            authority: query.authority,
            namespace: query.namespace,
            pageToken: listResponse.NextContinuationToken ?? null,
            references,
        },
    }
}
