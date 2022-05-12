import { ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3"
import { SOURCE_BUCKET_NAME } from "@phylopic/source-models"
import { Authority, Namespace } from "@phylopic/utils"
import { GetStaticProps, NextPage } from "next"
import Head from "next/head"
import Link from "next/link"
import React from "react"
import Breadcrumbs from "~/ui/Breadcrumbs"
export type Props = {
    authorizedNamespaces: ReadonlyArray<[Authority, Namespace]>
}
const Page: NextPage<Props> = ({ authorizedNamespaces }) => (
    <>
        <Head>
            <title>PhyloPic Editor: External Namespaces</title>
        </Head>
        <main>
            <header>
                <Breadcrumbs items={[{ href: "/", children: "Home" }, { children: "External Identifiers" }]} />
                <h1>External Identifiers</h1>
            </header>
            <section>
                <ul>
                    {authorizedNamespaces.map(([authority, namespace]) => (
                        <li key={`${authority}/${namespace}`}>
                            <Link href={`/externals/${encodeURIComponent(authority)}/${encodeURIComponent(namespace)}`}>
                                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                <a>
                                    <code>
                                        {authority}:{namespace}
                                    </code>
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
const getAuthorities = async (client: S3Client) => {
    let ContinuationToken: string | undefined
    const authorities: Authority[] = []
    do {
        const response = await client.send(
            new ListObjectsV2Command({
                Bucket: SOURCE_BUCKET_NAME,
                ContinuationToken,
                Delimiter: "/",
                Prefix: "externals/",
            }),
        )
        if (response.CommonPrefixes) {
            for (const commonPrefix of response.CommonPrefixes) {
                if (commonPrefix.Prefix) {
                    authorities.push(decodeURIComponent(commonPrefix.Prefix.slice("externals/".length)))
                }
            }
        }
        ContinuationToken = response.ContinuationToken
    } while (ContinuationToken)
    return authorities
}
const getNamespacesForAuthority = async (client: S3Client, authority: Authority) => {
    let ContinuationToken: string | undefined
    const namespaces: Namespace[] = []
    const Prefix = "externals/" + encodeURIComponent(authority) + "/"
    do {
        const response = await client.send(
            new ListObjectsV2Command({
                Bucket: SOURCE_BUCKET_NAME,
                ContinuationToken,
                Delimiter: "/",
                Prefix,
            }),
        )
        if (response.CommonPrefixes) {
            for (const commonPrefix of response.CommonPrefixes) {
                if (commonPrefix.Prefix) {
                    namespaces.push(decodeURIComponent(commonPrefix.Prefix.slice(Prefix.length)))
                }
            }
        }
        ContinuationToken = response.ContinuationToken
    } while (ContinuationToken)
    return namespaces
}
export const getStaticProps: GetStaticProps<Props> = async () => {
    const client = new S3Client({})
    const authorizedNamespaces: Array<[Authority, Namespace]> = []
    try {
        const authorities = await getAuthorities(client)
        const results = await Promise.all(
            authorities.map(async authority => {
                const namespaces = await getNamespacesForAuthority(client, authority)
                return namespaces.map(namespace => [authority, namespace] as [Authority, Namespace])
            }),
        )
        for (const result of results) {
            authorizedNamespaces.push(...result)
        }
    } finally {
        client.destroy()
    }
    return {
        props: { authorizedNamespaces },
    }
}
