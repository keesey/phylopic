import { ListObjectsV2Command, ListObjectsV2CommandOutput, S3Client } from "@aws-sdk/client-s3"
import { SUBMISSIONS_BUCKET_NAME } from "@phylopic/source-models"
import { isUUID, UUID } from "@phylopic/utils"
import { GetServerSideProps, NextPage } from "next"
import Head from "next/head"
import Link from "next/link"
import Breadcrumbs from "~/ui/Breadcrumbs"

export interface Props {
    contributions: readonly UUID[]
    index: number
    lastPage?: boolean
}
const PAGE_SIZE = 36
const Page: NextPage<Props> = ({ index, lastPage, contributions }) => (
    <>
        <Head>
            <title>PhyloPic Editor: Submissions</title>
        </Head>
        <main>
            <header>
                <Breadcrumbs items={[{ href: "/", children: "Home" }, { children: "Submissions" }]} />
                <h1>Submissions</h1>
            </header>
            <nav className="pagination">
                <ul>
                    {index > 0 && (
                        <li>
                            <Link href={`/submissions${index > 1 ? `?page=${index - 1}` : ""}`}>
                                &larr; Previous Page
                            </Link>
                        </li>
                    )}
                    <li>Page {index + 1}</li>
                    {!lastPage && (
                        <li>
                            <Link href={`/submissions?page=${index + 2}`}>Next Page &rarr;</Link>
                        </li>
                    )}
                </ul>
            </nav>
            <section>
                {contributions.length === 0 && <p>No submissions to review.</p>}
                {contributions.length > 0 && (
                    <ul>
                        {contributions.map(contribution => (
                            <li key={contribution}>
                                <Link href={`/submissions/${encodeURIComponent(contribution)}`}>
                                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                    <a>{contribution}</a>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </main>
    </>
)
export default Page
const getPageContributions = async (
    index: number,
    ContinuationToken?: string,
): Promise<Readonly<[readonly UUID[], boolean]>> => {
    const command = new ListObjectsV2Command({
        Bucket: SUBMISSIONS_BUCKET_NAME,
        ContinuationToken,
        Delimiter: "/",
        MaxKeys: PAGE_SIZE,
        Prefix: "contributions/",
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
                decodeURIComponent(Prefix?.replace(/^contributions\//, "").replace(/\/$/, "") ?? ""),
            ).filter(prefix => isUUID(prefix)),
            !result.NextContinuationToken,
        ]
    }
    if (!result.NextContinuationToken) {
        return [[], true]
    }
    return getPageContributions(index - 1, result.NextContinuationToken)
}
export const getServerSideProps: GetServerSideProps<Props> = async ({ query }) => {
    const page = typeof query.page === "string" ? parseInt(query.page, 10) : 1
    const index = isNaN(page) ? 0 : Math.max(0, page - 1)
    const [contributions, lastPage] = await getPageContributions(index)
    if (!contributions.length && index > 0) {
        return { notFound: true }
    }
    return {
        props: {
            contributions,
            index,
            lastPage,
        },
    }
}
