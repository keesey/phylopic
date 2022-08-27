import { AnchorLink } from "@phylopic/ui"
import { Authority } from "@phylopic/utils"
import { NextPage } from "next"
import Head from "next/head"
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
                    {items =>
                        items.length > 0 ? (
                            <ul>
                                {(items as readonly Authority[]).map(authority => (
                                    <li key={authority}>
                                        <AnchorLink href={`/externals/${encodeURIComponent(authority)}`}>
                                            <code>{authority}</code>
                                        </AnchorLink>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No authorities found.</p>
                        )
                    }
                </Paginator>
            </article>
        </main>
    </SWRConfig>
)
export default Page
