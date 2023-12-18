import { Entity, Node } from "@phylopic/source-models"
import { fetchJSON } from "@phylopic/ui"
import { UUID } from "@phylopic/utils"
import { NextPage } from "next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { FC, useCallback, useState } from "react"
import useSWR from "swr"
import Paginator from "~/pagination/Paginator"
import NodeSelector from "~/selectors/NodeSelector"
import Breadcrumbs from "~/ui/Breadcrumbs"
import NameView from "~/views/NameView"
const Page: NextPage = () => {
    const [modalOpen, setModalOpen] = useState(false)
    const router = useRouter()
    const handleNodeSelect = useCallback(
        (value: Entity<Node> | undefined) => {
            setModalOpen(false)
            if (value) {
                router.push(`/nodes/${value.uuid}`)
            }
        },
        [router],
    )
    return (
        <>
            <Head>
                <title>PhyloPic Editor: Nodes</title>
            </Head>
            <main>
                <header>
                    <Breadcrumbs items={[{ href: "/", children: <a>Home</a> }, { children: "Nodes" }]} />
                    <h1>Nodes</h1>
                </header>
                <a onClick={() => setModalOpen(true)} role="button">
                    Select a Node
                </a>
                <Paginator endpoint="/api/nodes">
                    {(items, invalidating) =>
                        items.length ? (
                            <ul>
                                {(items as ReadonlyArray<Node & { uuid: UUID }>).map(node => (
                                    <li key={node.uuid}>
                                        <Link href={`/nodes/${encodeURIComponent(node.uuid)}`}>
                                            <NodeView node={node} />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        ) : invalidating ? null : (
                            <p>No nodes found.</p>
                        )
                    }
                </Paginator>
            </main>
            <NodeSelector onSelect={handleNodeSelect} open={modalOpen} />
        </>
    )
}
export default Page
const NodeView: FC<{ node: Node & { uuid: UUID } }> = ({ node }) => {
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
