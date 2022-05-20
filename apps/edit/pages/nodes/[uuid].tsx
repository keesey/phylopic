import { S3Client } from "@aws-sdk/client-s3"
import { GetServerSideProps, NextPage } from "next"
import Head from "next/head"
import Link from "next/link"
import { isNode, isSource, Node, Source, SOURCE_BUCKET_NAME } from "@phylopic/source-models"
import React from "react"
import NodeEditorContainer from "~/contexts/NodeEditorContainer"
import NodeEditor from "~/editors/NodeEditor"
import Breadcrumbs from "~/ui/Breadcrumbs"
import NameTitleView from "~/views/NameTitleView"
import NameView from "~/views/NameView"
import TimesView from "~/views/TimesView"
import { ISOTimestamp, isUUID, UUID } from "@phylopic/utils"
import { getJSON } from "@phylopic/utils-aws"

export interface Props {
    modified?: ISOTimestamp
    node: Node
    parent?: Node
    source: Source
    uuid: UUID
}
const Page: NextPage<Props> = ({ modified, node, parent, source, uuid }) => (
    <NodeEditorContainer parent={parent} source={source} uuid={uuid} value={node}>
        <Head>
            <title>PhyloPic Editor: {node.names[0]?.map(part => part.text).join(" ")}</title>
        </Head>
        <main>
            <header>
                <Breadcrumbs
                    items={[
                        { href: "/", children: "Home" },
                        { href: "/nodes", children: "Nodes" },
                        {
                            children: (
                                <NameTitleView
                                    parent={node.parent ? { uuid: node.parent, value: parent } : undefined}
                                    name={node.names[0]}
                                />
                            ),
                        },
                    ]}
                />
                <h1>
                    <NameView name={node.names[0]} />
                </h1>
            </header>
            <nav>
                <ul>
                    <li>
                        <Link href={`/phylogeny?uuid=${encodeURIComponent(uuid)}`}>
                            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                            <a role="button">Phylogeny</a>
                        </Link>
                    </li>
                </ul>
            </nav>
            <NodeEditor />
            <footer>
                <TimesView created={node.created} modified={modified} />
            </footer>
        </main>
    </NodeEditorContainer>
)
export default Page
export const getServerSideProps: GetServerSideProps<Props> = async ({ query: { uuid } }) => {
    if (!isUUID(uuid)) {
        return { notFound: true }
    }
    const client = new S3Client({})
    let props: Props
    try {
        const [[node, output], [source]] = await Promise.all([
            getJSON<Node>(
                client,
                {
                    Bucket: SOURCE_BUCKET_NAME,
                    Key: `nodes/${uuid}/meta.json`,
                },
                isNode,
            ),
            getJSON<Source>(
                client,
                {
                    Bucket: SOURCE_BUCKET_NAME,
                    Key: "meta.json",
                },
                isSource,
            ),
        ])
        const [parent] = node?.parent
            ? await getJSON<Node>(client, {
                  Bucket: SOURCE_BUCKET_NAME,
                  Key: `nodes/${node.parent}/meta.json`,
              })
            : []
        props = {
            modified: output.LastModified?.toUTCString(),
            node,
            ...(parent ? { parent } : null),
            source,
            uuid,
        }
    } finally {
        client.destroy()
    }
    return { props }
}
