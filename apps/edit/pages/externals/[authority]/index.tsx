import { AnchorLink } from "@phylopic/ui"
import { Authority, isAuthority, Namespace } from "@phylopic/utils"
import { GetStaticPaths, GetStaticProps, NextPage } from "next"
import Head from "next/head"
import { SWRConfig } from "swr"
import Paginator from "~/pagination/Paginator"
import Breadcrumbs from "~/ui/Breadcrumbs"
export type Props = {
    authority: Authority
}
const Page: NextPage<Props> = ({ authority }) => (
    <SWRConfig>
        <Head>
            <title>PhyloPic Editor: External Authority: {JSON.stringify(authority)}</title>
        </Head>
        <main>
            <header>
                <Breadcrumbs
                    items={[
                        { href: "/", children: <a>Home</a> },
                        { href: "/externals", children: <a>External Authorities</a> },
                        { children: <code>{authority}</code> },
                    ]}
                />
                <h1>
                    <code>{authority}</code>
                </h1>
            </header>
            <article>
                <Paginator endpoint={`/api/externals/${encodeURIComponent(authority)}`}>
                    {(items, invalidating) =>
                        items.length > 0 ? (
                            <ul>
                                {(items as readonly Namespace[]).map(namespace => (
                                    <li key={namespace}>
                                        <AnchorLink
                                            href={`/externals/${encodeURIComponent(authority)}/${encodeURIComponent(
                                                namespace,
                                            )}`}
                                        >
                                            <code>
                                                {authority}/{namespace}
                                            </code>
                                        </AnchorLink>
                                    </li>
                                ))}
                            </ul>
                        ) : invalidating ? null : (
                            <p>No namespaces found.</p>
                        )
                    }
                </Paginator>
            </article>
        </main>
    </SWRConfig>
)
export default Page
export const getStaticProps: GetStaticProps<Props> = context => {
    const { authority } = context.params ?? {}
    if (!isAuthority(authority)) {
        return { notFound: true }
    }
    return { props: { authority } }
}
export const getStaticPaths: GetStaticPaths = async () => {
    return {
        fallback: "blocking",
        paths: [],
    }
}
