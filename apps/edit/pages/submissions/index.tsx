import { S3Entry } from "@phylopic/source-client"
import { Hash } from "@phylopic/utils"
import { NextPage } from "next"
import Head from "next/head"
import Link from "next/link"
import { SWRConfig } from "swr"
import Paginator from "~/pagination/Paginator"
import Breadcrumbs from "~/ui/Breadcrumbs"
import SubmissionView from "~/views/SubmissionView"
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
                                {(items as ReadonlyArray<S3Entry<Hash>>).map(item => (
                                    <li key={item.Key}>
                                        <Link href={`/submissions/${encodeURIComponent(item.Key)}`}>
                                            <SubmissionView hash={item.Key} />
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
