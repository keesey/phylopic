import { INCOMPLETE_STRING, Node } from "@phylopic/source-models"
import { Loader } from "@phylopic/ui"
import { isUUIDv4, stringifyNomen, UUID } from "@phylopic/utils"
import { GetStaticPaths, GetStaticProps, NextPage } from "next"
import Head from "next/head"
import { FC, useMemo } from "react"
import useSWR, { SWRConfig } from "swr"
import NodeEditor from "~/editors/NodeEditor"
import fetchJSON from "~/fetch/fetchJSON"
import Breadcrumbs from "~/ui/Breadcrumbs"
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
    const { data: node } = useSWR<Node & { uuid: UUID }>(`/api/nodes/_/${uuid}`, fetchJSON)
    const { data: parent } = useSWR<Node & { uuid: UUID }>(node ? `/api/nodes/_/${node.parent}` : null, fetchJSON)
    const nameText = useMemo(() => (node ? stringifyNomen(node.names[0]) : INCOMPLETE_STRING), [node])
    return (
        <>
            <Head>
                <title>PhyloPic Editor: {nameText}</title>
            </Head>
            {!node && (
                <Loader />
            )}
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
            <footer>
                <TimesView created={node?.created} modified={node?.modified} />
            </footer>
        </main>

            )}>
        </>
    )
}
