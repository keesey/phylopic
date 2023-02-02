import { Contributor, INCOMPLETE_STRING, Submission } from "@phylopic/source-models"
import { fetchJSON } from "@phylopic/ui"
import { Hash, UUID } from "@phylopic/utils"
import { NextPage } from "next"
import Head from "next/head"
import Link from "next/link"
import { FC } from "react"
import useSWR, { SWRConfig } from "swr"
import Paginator from "~/pagination/Paginator"
import Breadcrumbs from "~/ui/Breadcrumbs"
import SubmissionNameView from "~/views/SubmissionNameView"
const Page: NextPage = () => {
    return (
        <SWRConfig>
            <Head>
                <title>PhyloPic Editor: Submissions</title>
            </Head>
            <main>
                <header>
                    <Breadcrumbs items={[{ href: "/", children: <a>Home</a> }, { children: "Submissions" }]} />
                    <h1>Submissions</h1>
                </header>
                <Paginator endpoint="/api/submissions">
                    {(items, invalidating) =>
                        items.length ? (
                            <ul>
                                {(items as ReadonlyArray<Hash>).map(hash => (
                                    <li key={hash}>
                                        <Link href={`/submissions/${encodeURIComponent(hash)}`}>
                                            <SubmissionView hash={hash} />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        ) : invalidating ? null : (
                            <p>No submissions found.</p>
                        )
                    }
                </Paginator>
            </main>
        </SWRConfig>
    )
}
export default Page
const SubmissionView: FC<{ hash: Hash }> = ({ hash }) => {
    const { data: submission, error } = useSWR<Submission>(`/api/submissions/_/${encodeURIComponent(hash)}`, fetchJSON)
    const { data: contributor } = useSWR<Contributor & { uuid: UUID }>(
        submission?.contributor ? `/api/contributors/_/${encodeURIComponent(submission.contributor)}` : null,
        fetchJSON,
    )
    if (error) {
        return (
            <>
                <strong>Error!</strong> {String(error)}
            </>
        )
    }
    if (!submission) {
        return <>{INCOMPLETE_STRING}</>
    }
    return (
        <>
            {submission ? <SubmissionNameView submission={submission} /> : INCOMPLETE_STRING}
            <> by </>
            {submission.attribution || "[Anonymous]"}
            <> (uploaded by {contributor ? contributor.name : INCOMPLETE_STRING})</>
        </>
    )
}
