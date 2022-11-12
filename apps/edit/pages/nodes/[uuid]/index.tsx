import { Entity, External, INCOMPLETE_STRING, Node } from "@phylopic/source-models"
import { AnchorLink, fetchJSON, Loader } from "@phylopic/ui"
import { Authority, getIdentifier, isUUIDv4, Namespace, ObjectID, stringifyNomen, UUID } from "@phylopic/utils"
import axios from "axios"
import { GetStaticPaths, GetStaticProps, NextPage } from "next"
import Head from "next/head"
import { FC, useCallback, useMemo, useState } from "react"
import useSWR, { SWRConfig } from "swr"
import NodeEditor from "~/editors/NodeEditor"
import Paginator from "~/pagination/Paginator"
import NodeSelector from "~/selectors/NodeSelector"
import Breadcrumbs from "~/ui/Breadcrumbs"
import BubbleItem from "~/ui/BubbleItem"
import BubbleList from "~/ui/BubbleList"
import ExternalView from "~/views/ExternalView"
import NameView from "~/views/NameView"
import TimesView from "~/views/TimesView"
export type Props = {
    uuid: UUID
}
const Page: NextPage<Props> = ({ uuid }) => {
    return (
        <SWRConfig>
            <Content uuid={uuid} />
        </SWRConfig>
    )
}
export default Page
export const getStaticProps: GetStaticProps<Props> = context => {
    const { uuid } = context.params ?? {}
    if (!isUUIDv4(uuid)) {
        return { notFound: true }
    }
    return { props: { uuid } }
}
export const getStaticPaths: GetStaticPaths = async () => {
    return {
        fallback: "blocking",
        paths: [],
    }
}
const Content: FC<Props> = ({ uuid }) => {
    const [merging, setMerging] = useState(false)
    const { data: node, mutate: mutateNode } = useSWR<Node & { uuid: UUID }>(`/api/nodes/_/${uuid}`, fetchJSON)
    const { data: parent, mutate: mutateParent } = useSWR<Node & { uuid: UUID }>(
        node ? `/api/nodes/_/${node.parent}` : null,
        fetchJSON,
    )
    const nameText = useMemo(() => (node ? stringifyNomen(node.names[0]) : INCOMPLETE_STRING), [node])
    const handleMergeSelect = useCallback(
        async (suppressed: Entity<Node> | undefined) => {
            if (suppressed && node && parent) {
                const promise = axios.post<undefined>("/api/nodes/merge", {
                    conserved: uuid,
                    suppressed: suppressed.uuid,
                })
                mutateNode(
                    promise.then(() => node),
                    { revalidate: true },
                )
                mutateParent(
                    promise.then(() => parent),
                    { revalidate: true },
                )
                await promise
            }
            setMerging(false)
        },
        [mutateNode, mutateParent, node, parent, uuid],
    )
    return (
        <>
            <Head>
                <title>PhyloPic Editor: {nameText}</title>
            </Head>
            {!node && <Loader />}
            {node && (
                <main>
                    <header>
                        <Breadcrumbs
                            items={[
                                { href: "/", children: "Home" },
                                { href: "/nodes", children: "Nodes" },
                                {
                                    href: node ? `/nodes/${node.parent}` : undefined,
                                    children: parent ? (
                                        <a>
                                            <NameView name={parent?.names[0]} short />
                                        </a>
                                    ) : (
                                        INCOMPLETE_STRING
                                    ),
                                },
                                {
                                    children: node ? <NameView name={node.names[0]} /> : INCOMPLETE_STRING,
                                },
                            ]}
                        />
                        <h1>{node && <NameView name={node.names[0]} />}</h1>
                    </header>
                    <NodeEditor uuid={uuid} />
                    <section>
                        <h2>Children</h2>
                        <Paginator endpoint={`/api/nodes/_/${encodeURIComponent(uuid)}/children`}>
                            {(children, isValidating) =>
                                children.length ? (
                                    <BubbleList>
                                        {(children as ReadonlyArray<Node & { uuid: UUID }>).map(child => (
                                            <BubbleItem key={child.uuid}>
                                                <AnchorLink href={`/nodes/${encodeURIComponent(child.uuid)}`}>
                                                    <NameView name={child.names[0]} short />
                                                </AnchorLink>
                                            </BubbleItem>
                                        ))}
                                    </BubbleList>
                                ) : isValidating ? (
                                    <Loader />
                                ) : (
                                    <p>This is a terminal node.</p>
                                )
                            }
                        </Paginator>
                    </section>
                    <Paginator endpoint={`/api/nodes/_/${encodeURIComponent(uuid)}/externals`}>
                        {(children, isValidating) =>
                            children.length ? (
                                <section>
                                    <h2>Externals</h2>
                                    <BubbleList>
                                        {(
                                            children as ReadonlyArray<
                                                External & {
                                                    authority: Authority
                                                    namespace: Namespace
                                                    objectID: ObjectID
                                                }
                                            >
                                        ).map(external => {
                                            const identifier = getIdentifier(
                                                external.authority,
                                                external.namespace,
                                                external.objectID,
                                            )
                                            return (
                                                <BubbleItem key={identifier}>
                                                    <ExternalView external={external} />
                                                </BubbleItem>
                                            )
                                        })}
                                    </BubbleList>
                                </section>
                            ) : isValidating ? (
                                <Loader />
                            ) : null
                        }
                    </Paginator>
                    <section>
                        <button onClick={() => setMerging(true)}>Absorb Another Node</button>
                        <NodeSelector open={merging} onSelect={handleMergeSelect} />
                    </section>
                    <footer>
                        <TimesView created={node?.created} modified={node?.modified} />
                    </footer>
                </main>
            )}
        </>
    )
}
