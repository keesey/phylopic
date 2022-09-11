import { iterateList, SourceClient } from "@phylopic/source-client"
import { Node } from "@phylopic/source-models"
import { getIdentifier, isScientific, Nomen, stringifyNomen, UUID } from "@phylopic/utils"
import axios from "axios"
type PBDBRecord = Readonly<{
    ext: string
    flg?: string
    nam: string
    noc: number
    oid: string
    rid: string
    rnk: number
}>
type PBDBResponse = Readonly<{
    // Abridged.
    records: readonly PBDBRecord[]
}>
const getScientificNames = (names: readonly Nomen[]) =>
    names.filter(isScientific).map(name =>
        name
            .filter(part => part.class === "scientific")
            .map(part => part.text)
            .join(" "),
    )
const ACCEPTED_ANCESTOR_RANKS = new Set([23, 20])
const isAcceptableAncestor = (ancestor: PBDBRecord) => ACCEPTED_ANCESTOR_RANKS.has(ancestor.rnk)
const processNode = async (client: SourceClient, node: Node & { uuid: UUID }, ancestors: readonly PBDBRecord[]) => {
    const ancestorNames = ancestors.map(ancestor => ancestor.nam)
    console.info(
        "Processing",
        ["Life", ...ancestorNames].join(" > "),
        ">",
        stringifyNomen(node.names[0]),
        `(${node.uuid})...`,
    )
    let mainRecord: PBDBRecord | undefined
    const page = await client.node(node.uuid).externals.namespace("paleobiodb.org", "txn").page()
    if (page.items.length) {
        const response = await axios.get<PBDBResponse>(
            `https://paleobiodb.org/data1.2/taxa/single.json?id=${encodeURIComponent(page.items[0].objectID)}`,
        )
        const record = response.data.records[0]
        mainRecord = record
    } else {
        const names = getScientificNames(node.names)
        for (const name of names) {
            const response = await axios.get<PBDBResponse>(
                `https://paleobiodb.org/data1.2/taxa/list.json?name=${encodeURIComponent(
                    [...ancestorNames, name].join(":"),
                )}&rel=synonyms`,
            )
            if (response.data.records.length > 0) {
                for (const record of [...response.data.records].sort(
                    (a, b) => (a.flg === "B" ? -1 : 1) - (b.flg === "B" ? -1 : 1),
                )) {
                    if (!mainRecord) {
                        mainRecord = record
                    }
                    const oid = record.oid.replace(/^txn:/, "")
                    const externalClient = client.external("paleobiodb.org", "txn", oid)
                    if (await externalClient.exists()) {
                        console.info(`${getIdentifier("paleobiodb.org", "txn", oid)} is already assigned.`)
                    } else {
                        console.info(
                            `${getIdentifier("paleobiodb.org", "txn", oid)} (${record.nam}) => phylopic.org/nodes/${
                                node.uuid
                            } (${stringifyNomen(node.names[0])})`,
                        )
                        await externalClient.put({
                            authority: "paleobiodb.org",
                            namespace: "txn",
                            node: node.uuid,
                            objectID: oid,
                            title: record.nam,
                        })
                    }
                }
            }
        }
    }
    if (mainRecord) {
        const response = await axios.get<PBDBResponse>(
            `https://paleobiodb.org/data1.2/taxa/list.json?id=${encodeURIComponent(mainRecord.oid)}&rel=all_parents`,
        )
        ancestors = response.data.records.filter(isAcceptableAncestor)
    }
    for await (const child of iterateList(client.node(node.uuid).children)) {
        await processNode(client, child, ancestors)
    }
}
const autolinkPBDB = async (client: SourceClient): Promise<void> => {
    const node = await client.root.get()
    await processNode(client, node, [])
}
export default autolinkPBDB
