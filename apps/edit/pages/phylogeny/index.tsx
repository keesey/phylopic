import { S3Client } from "@aws-sdk/client-s3"
import { getLineage, isNode, isSource, Node, normalizeArcs, Source, SOURCE_BUCKET_NAME } from "@phylopic/source-models"
import { isUUID, UUID } from "@phylopic/utils"
import { getJSON } from "@phylopic/utils-aws"
import { GetServerSideProps, NextPage } from "next"
import Head from "next/head"
import { ParsedUrlQuery } from "querystring"
import React from "react"
import PhylogenyEditorContainer from "~/contexts/PhylogenyEditorContainer"
import { Arc, NodesMap } from "~/contexts/PhylogenyEditorContainer/State"
import PhylogenyEditor from "~/editors/PhylogenyEditor"
import Breadcrumbs from "~/ui/Breadcrumbs"

export interface Props {
    arcs: readonly Arc[]
    nodesMap: NodesMap
}
const Page: NextPage<Props> = ({ arcs, nodesMap }) => (
    <PhylogenyEditorContainer arcs={arcs} nodesMap={nodesMap}>
        <Head>
            <title>PhyloPic Editor: Phylogeny</title>
        </Head>
        <main>
            <header>
                <Breadcrumbs items={[{ href: "/", children: "Home" }, { children: "Phylogeny" }]} />
                <h1>Phylogeny</h1>
            </header>
            <PhylogenyEditor />
        </main>
    </PhylogenyEditorContainer>
)
export default Page
const getProps = async (client: S3Client, query: ParsedUrlQuery, rootUUID: UUID, rootNode: Node): Promise<Props> => {
    if (
        (typeof query.uuid === "string" && isUUID(query.uuid)) ||
        (Array.isArray(query.uuid) && query.uuid.every(uuid => isUUID(uuid)))
    ) {
        const uuids = Array.isArray(query.uuid) ? query.uuid : [query.uuid]
        const lineages = await Promise.all(uuids.map(uuid => getLineage(client, uuid, rootUUID)))
        if (lineages.length) {
            return lineages.reduce<Props>(
                (prev, lineage) => {
                    const arcs = lineage.reduce<Arc[]>(
                        (prevArcs, entity, index, array) =>
                            index ? [...prevArcs, [array[index - 1].uuid, entity.uuid]] : prevArcs,
                        [],
                    )
                    const nodesMap = lineage.reduce<NodesMap>(
                        (prevNodesMap, entity) =>
                            prev.nodesMap[entity.uuid]
                                ? prevNodesMap
                                : { ...prevNodesMap, [entity.uuid]: entity.value },
                        {},
                    )
                    return {
                        ...prev,
                        arcs: normalizeArcs([...prev.arcs, ...arcs]),
                        nodesMap: {
                            ...prev.nodesMap,
                            ...nodesMap,
                        },
                    }
                },
                {
                    arcs: [],
                    nodesMap: {
                        [rootUUID]: rootNode,
                    },
                },
            )
        }
    }
    return {
        arcs: [],
        nodesMap: {
            [rootUUID]: rootNode,
        },
    }
}
export const getServerSideProps: GetServerSideProps<Props> = async ({ query }) => {
    let props: Props
    const client = new S3Client({})
    try {
        const [{ root }] = await getJSON<Source>(
            client,
            {
                Bucket: SOURCE_BUCKET_NAME,
                Key: "meta.json",
            },
            isSource,
        )
        const [rootNode] = await getJSON<Node>(
            client,
            {
                Bucket: SOURCE_BUCKET_NAME,
                Key: `nodes/${root}/meta.json`,
            },
            isNode,
        )
        props = await getProps(client, query, root, rootNode)
    } finally {
        client.destroy()
    }
    return { props }
}
