import { Contributor, INCOMPLETE_STRING } from "@phylopic/source-models"
import { UUID } from "@phylopic/utils"
import { NextPage } from "next"
import Head from "next/head"
import Link from "next/link"
import { FC } from "react"
import Paginator from "~/pagination/Paginator"
import Breadcrumbs from "~/ui/Breadcrumbs"
const Page: NextPage = () => {
    return (
        <>
            <Head>
                <title>PhyloPic Editor: Contributors</title>
            </Head>
            <main>
                <header>
                    <Breadcrumbs items={[{ href: "/", children: <a>Home</a> }, { children: "Contributors" }]} />
                    <h1>Contributors</h1>
                </header>
                <Paginator endpoint="/api/contributors">
                    {(items, invalidating) =>
                        items.length ? (
                            <ul>
                                {(items as ReadonlyArray<Contributor & { uuid: UUID }>).map(contributor => (
                                    <li key={contributor.uuid}>
                                        <Link href={`/contributor/${encodeURIComponent(contributor.uuid)}`}>
                                            <ContributorView contributor={contributor} />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        ) : invalidating ? null : (
                            <p>No contributors found.</p>
                        )
                    }
                </Paginator>
            </main>
        </>
    )
}
export default Page
const ContributorView: FC<{ contributor: Contributor & { uuid: UUID } }> = ({ contributor }) => {
    return (
        <>
            {contributor.name || INCOMPLETE_STRING}{" "}
            <code>
                &lt;<a href={`mailto:${contributor.emailAddress}`}>{contributor.emailAddress}</a>&gt;
            </code>
        </>
    )
}
