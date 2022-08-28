import { External } from "@phylopic/source-models"
import { AnchorLink } from "@phylopic/ui"
import { Authority, isAuthority, isNamespace, Namespace, ObjectID } from "@phylopic/utils"
import { GetStaticPaths, GetStaticProps, NextPage } from "next"
import Head from "next/head"
import { SWRConfig } from "swr"
import Paginator from "~/pagination/Paginator"
import Breadcrumbs from "~/ui/Breadcrumbs"
export type Props = {
    authority: Authority
    namespace: Namespace
}
const Page: NextPage<Props> = ({ authority, namespace }) => (
    <SWRConfig>
        <Head>
            <title>PhyloPic Editor: External Namespace: {JSON.stringify(authority + "/" + namespace)}</title>
        </Head>
        <main>
            <header>
                <Breadcrumbs
                    items={[
                        { href: "/", children: <a>Home</a> },
                        { href: "/externals", children: <a>External Authorities</a> },
                        {
                            href: `/externals/${encodeURIComponent(authority)}`,
                            children: (
                                <a>
                                    <code>{authority}</code>
                                </a>
                            ),
                        },
                        { children: <code>{namespace}</code> },
                    ]}
                />
                <h1>
                    <code>
                        {authority}/{namespace}
                    </code>
                </h1>
            </header>
            <article>
                <Paginator
                    endpoint={`/api/externals/${encodeURIComponent(authority)}/${encodeURIComponent(namespace)}`}
                >
                    {(items, invalidating) =>
                        items.length > 0 ? (
                            <ul>
                                {(items as ReadonlyArray<External & { objectID: ObjectID }>).map(external => (
                                    <li key={external.objectID}>
                                        <AnchorLink
                                            href={`/externals/${encodeURIComponent(authority)}/${encodeURIComponent(
                                                namespace,
                                            )}/${encodeURIComponent(external.objectID)}`}
                                        >
                                            {external.title} <code>[{external.objectID}]</code>
                                        </AnchorLink>
                                    </li>
                                ))}
                            </ul>
                        ) : invalidating ? null : (
                            <p>No objects found.</p>
                        )
                    }
                </Paginator>
            </article>
        </main>
    </SWRConfig>
)
export default Page
export const getStaticProps: GetStaticProps<Props> = context => {
    const { authority, namespace } = context.params ?? {}
    if (!isAuthority(authority) || !isNamespace(namespace)) {
        return { notFound: true }
    }
    return { props: { authority, namespace } }
}
export const getStaticPaths: GetStaticPaths = context => {
    return {
        fallback: "blocking",
        paths: [],
    }
}
