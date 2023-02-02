import { Authority } from "@phylopic/utils"
import { NextPage } from "next"
import Head from "next/head"
import Link from "next/link"
import { SWRConfig } from "swr"
import Paginator from "~/pagination/Paginator"
import Breadcrumbs from "~/ui/Breadcrumbs"
const Page: NextPage = () => (
    <SWRConfig>
        <Head>
            <title>PhyloPic Editor: External Authorities</title>
        </Head>
        <main>
            <header>
                <Breadcrumbs items={[{ href: "/", children: <a>Home</a> }, { children: "External Authorities" }]} />
                <h1>External Authorities</h1>
            </header>
            <article>
                <Paginator endpoint="/api/externals">
                    {(items, invalidating) =>
                        items.length > 0 ? (
                            <ul>
                                {(items as readonly Authority[]).map(authority => (
                                    <li key={authority}>
                                        <Link href={`/externals/${encodeURIComponent(authority)}`}>
                                            <code>{authority}</code>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        ) : invalidating ? null : (
                            <p>No authorities found.</p>
                        )
                    }
                </Paginator>
            </article>
        </main>
    </SWRConfig>
)
export default Page
