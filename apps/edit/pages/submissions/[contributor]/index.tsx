import { ListObjectsV2Command, ListObjectsV2CommandOutput, S3Client } from "@aws-sdk/client-s3"
import { CONTRIBUTE_BUCKET_NAME } from "@phylopic/source-models"
import { EmailAddress, isDefined, isEmailAddress, isUUID, UUID } from "@phylopic/utils"
import { GetServerSideProps, NextPage } from "next"
import Head from "next/head"
import Link from "next/link"
import React from "react"
import ApproveAllButton from "~/editors/ApproveAllButton"
import Breadcrumbs from "~/ui/Breadcrumbs"

export interface Props {
    contributor: EmailAddress
    index: number
    lastPage?: boolean
    uuids: readonly UUID[]
}
const PAGE_SIZE = 36
const Page: NextPage<Props> = ({ contributor, index, lastPage, uuids }) => (
    <>
        <Head>
            <title>PhyloPic Editor: Submissions from {contributor}</title>
        </Head>
        <main>
            <header>
                <Breadcrumbs
                    items={[
                        { href: "/", children: "Home" },
                        { href: "/submissions", children: "Submissions" },
                    ]}
                />
                <h1>
                    Submissions from <a href={`mailto:${encodeURIComponent(contributor)}`}>{contributor}</a>
                </h1>
            </header>
            <nav className="pagination">
                <ul>
                    {index > 0 && (
                        <li>
                            <Link
                                href={`/submissions/${encodeURIComponent(contributor)}${
                                    index > 1 ? `?page=${index - 1}` : ""
                                }`}
                            >
                                &larr; Previous Page
                            </Link>
                        </li>
                    )}
                    <li>Page {index + 1}</li>
                    {!lastPage && (
                        <li>
                            <Link href={`/submissions/${encodeURIComponent(contributor)}?page=${index + 2}`}>
                                Next Page &rarr;
                            </Link>
                        </li>
                    )}
                </ul>
            </nav>
            <section>
                {uuids.length === 0 && <p>No submissions to review.</p>}
                {uuids.length > 0 && (
                    <>
                        <ul className="image-list">
                            {uuids.map(uuid => (
                                <li key={uuid}>
                                    <Link href={`/submissions/${encodeURIComponent(contributor)}/${uuid}`}>
                                        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                        <a>
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                alt={`Submission ${uuid}`}
                                                height={150}
                                                src={`/api/submissionfiles/${encodeURIComponent(contributor)}/${uuid}`}
                                                style={{ objectFit: "contain" }}
                                                width={150}
                                            />
                                        </a>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <ApproveAllButton contributor={contributor} />
                    </>
                )}
            </section>
        </main>
    </>
)
export default Page
const getPageUUIDs = async (
    contributor: EmailAddress,
    index: number,
    token?: string,
): Promise<Readonly<[readonly UUID[], boolean]>> => {
    const command = new ListObjectsV2Command({
        Bucket: CONTRIBUTE_BUCKET_NAME,
        ContinuationToken: token,
        Delimiter: "/",
        MaxKeys: PAGE_SIZE,
        Prefix: `contributors/${encodeURIComponent(contributor)}/images/`,
    })
    const client = new S3Client({})
    let result: ListObjectsV2CommandOutput
    try {
        result = await client.send(command)
    } finally {
        client.destroy()
    }
    if (!result.CommonPrefixes) {
        return [[], true]
    }
    if (!index) {
        return [
            result.CommonPrefixes.map(({ Prefix }) =>
                Prefix?.replace(/^contributors\/[^/]+\/images\//, "").replace(/\/$/, ""),
            )
                .filter(isDefined)
                .filter(prefix => isUUID(prefix)),
            !result.NextContinuationToken,
        ]
    }
    if (!result.NextContinuationToken) {
        return [[], true]
    }
    return getPageUUIDs(contributor, index - 1, result.NextContinuationToken)
}
export const getServerSideProps: GetServerSideProps<Props> = async ({ params, query }) => {
    const { contributor } = params ?? {}
    if (!isEmailAddress(contributor)) {
        console.warn("Not a valid email address: ", contributor)
        return { notFound: true }
    }
    const page = typeof query.page === "string" ? parseInt(query.page, 10) : 1
    const index = isNaN(page) ? 0 : Math.max(0, page - 1)
    const [uuids, lastPage] = await getPageUUIDs(contributor, index)
    if (!uuids.length && index > 0) {
        return { notFound: true }
    }
    return {
        props: {
            contributor,
            index,
            lastPage,
            uuids,
        },
    }
}
