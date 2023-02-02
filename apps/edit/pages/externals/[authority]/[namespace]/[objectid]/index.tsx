import { Entity, External, Node } from "@phylopic/source-models"
import { fetchJSON, Loader } from "@phylopic/ui"
import { Authority, isAuthority, isNamespace, isObjectID, Namespace, ObjectID, UUID } from "@phylopic/utils"
import axios from "axios"
import { GetStaticPaths, GetStaticProps, NextPage } from "next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { FC, useCallback, useState } from "react"
import useSWR, { SWRConfig } from "swr"
import NodeSelector from "~/selectors/NodeSelector"
import Breadcrumbs from "~/ui/Breadcrumbs"
import BubbleItem from "~/ui/BubbleItem"
import BubbleList from "~/ui/BubbleList"
import NameView from "~/views/NameView"
export type Props = {
    authority: Authority
    namespace: Namespace
    objectID: ObjectID
}
const Page: NextPage<Props> = ({ authority, namespace, objectID }) => (
    <SWRConfig>
        <Head>
            <title>
                PhyloPic Editor: External Object: {JSON.stringify(authority + "/" + namespace + "/" + objectID)}
            </title>
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
                        {
                            href: `/externals/${encodeURIComponent(authority)}/${encodeURIComponent(namespace)}`,
                            children: (
                                <a>
                                    <code>{namespace}</code>
                                </a>
                            ),
                        },
                        { children: <code>{objectID}</code> },
                    ]}
                />
                <h1>
                    <code>
                        {authority}/{namespace}/{objectID}
                    </code>
                </h1>
            </header>
            <article>
                <Content authority={authority} namespace={namespace} objectID={objectID} />
            </article>
        </main>
    </SWRConfig>
)
export default Page
export const getStaticProps: GetStaticProps<Props> = context => {
    const { authority, namespace, objectid } = context.params ?? {}
    if (!isAuthority(authority) || !isNamespace(namespace) || !isObjectID(objectid)) {
        return { notFound: true }
    }
    return { props: { authority, namespace, objectID: objectid } }
}
export const getStaticPaths: GetStaticPaths = () => {
    return {
        fallback: "blocking",
        paths: [],
    }
}
const Content: FC<Props> = ({ authority, namespace, objectID }) => {
    const [selecting, setSelecting] = useState(false)
    const key = `/api/externals/${encodeURIComponent(authority)}/${encodeURIComponent(namespace)}/${encodeURIComponent(
        objectID,
    )}`
    const { data: external, error: externalError, mutate } = useSWR<External & Props>(key, fetchJSON)
    const { data: node, error: nodeError } = useSWR<Node & { uuid: UUID }>(
        () => (external?.node ? `/api/nodes/_/${encodeURIComponent(external.node)}` : null),
        fetchJSON,
    )
    const router = useRouter()
    const deleteExternal = useCallback(() => {
        if (confirm("Are you sure?")) {
            ;(async () => {
                await axios.delete(key)
                mutate(undefined, { revalidate: true })
                router.push(`/externals/${encodeURIComponent(authority)}/${encodeURIComponent(namespace)}`)
            })()
        }
    }, [authority, key, mutate, namespace, router])
    const handleSelect = useCallback(
        (value: Entity<Node> | undefined) => {
            if (external && node && value && value.uuid !== node.uuid) {
                ;(async () => {
                    const newValue = { ...external, node: value.uuid }
                    await axios.put(key, newValue)
                    mutate(newValue, { optimisticData: newValue, revalidate: true, rollbackOnError: true })
                })()
            }
            setSelecting(false)
        },
        [external, key, mutate, node],
    )
    if (!external || !node) {
        if (externalError || nodeError) {
            return <strong>{String(externalError ?? nodeError)}</strong>
        }
        return <Loader />
    }
    return (
        <section>
            <p>
                <strong>{external.title}</strong> &rarr;{" "}
                <Link href={`/nodes/${encodeURIComponent(node.uuid)}`}>
                    <NameView name={node.names[0]} />
                </Link>
            </p>
            <BubbleList>
                <BubbleItem light>
                    <button className="link" onClick={() => setSelecting(true)}>
                        Change the node
                    </button>
                </BubbleItem>
                <BubbleItem>
                    <button className="link" onClick={deleteExternal}>
                        Delete
                    </button>
                </BubbleItem>
            </BubbleList>
            <NodeSelector open={selecting} onSelect={handleSelect} />
        </section>
    )
}
