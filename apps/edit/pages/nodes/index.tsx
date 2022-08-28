import { Node } from "@phylopic/source-models"
import { AnchorLink, Loader } from "@phylopic/ui"
import { UUID } from "@phylopic/utils"
import { NextPage } from "next"
import Head from "next/head"
import { FC } from "react"
import useSWR from "swr"
import fetchJSON from "~/fetch/fetchJSON"
import Paginator from "~/pagination/Paginator"
import Breadcrumbs from "~/ui/Breadcrumbs"
import NameView from "~/views/NameView"
const Page: NextPage = () => (
    <>
        <Head>
            <title>PhyloPic Editor: Nodes</title>
        </Head>
        <main>
            <header>
                <Breadcrumbs items={[{ href: "/", children: <a>Home</a> }, { children: "Nodes" }]} />
                <h1>Nodes</h1>
            </header>
            <Paginator endpoint="/api/nodes">
                {(items, invalidating) =>
                    items.length ? (
                        <ul>
                            {(items as ReadonlyArray<Node & { uuid: UUID }>).map(node => (
                                <li key={node.uuid}>
                                    <AnchorLink href={`/nodes/${encodeURIComponent(node.uuid)}`}>
                                        <NodeView node={node} />
                                    </AnchorLink>
                                </li>
                            ))}
                        </ul>
                    ) : invalidating ? null : (
                        <p>No nodes found.</p>
                    )
                }
            </Paginator>
        </main>
    </>
)
export default Page
const NodeView: FC<{ node: Node & { uuid: UUID } }> = ({ node }) => {
    node.parent
    const { data: parent } = useSWR<Node & { uuid: UUID }>(
        node.parent ? `/api/nodes/_/${encodeURIComponent(node.parent)}` : null,
        fetchJSON,
    )
    return (
        <>
            <NameView name={node.names[0]} />
            {parent && (
                <>
                    {" "}
                    (<NameView name={parent.names[0]} short />)
                </>
            )}
        </>
    )
}
