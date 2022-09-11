import { iterateList, SourceClient } from "@phylopic/source-client"
import { Node } from "@phylopic/source-models"
import { getIdentifier, isScientific, Nomen, stringifyNomen, UUID } from "@phylopic/utils"
import axios from "axios"
type PBDBRecord = Readonly<{
    ext: string
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
// :KLUDGE:
const ANCESTOR_TITLE_BLOCK_LIST = ["Archaea", "Biota", "Chromalveolata", "Life", "Prokaryota", "Sarcomastigota"] // These are either not helpful or are used differently in PaleobioDB
const processNode = async (client: SourceClient, node: Node & { uuid: UUID }, ancestorTitles: readonly string[]) => {
    console.info("Processing", ancestorTitles.join(" > "), ">", stringifyNomen(node.names[0]), `(${node.uuid})...`)
    let title: string | undefined
    const page = await client.node(node.uuid).externals.namespace("paleobiodb.org", "txn").page()
    if (page.items.length) {
        const childrenResponse = await axios.get<PBDBResponse>(
            `https://paleobiodb.org/data1.2/taxa/list.json?id=${encodeURIComponent(
                page.items[0].objectID,
            )}&rel=children`,
        )
        if (childrenResponse.data.records.length > 0) {
            title = page.items[0].title
        }
    } else {
        let numChildrenForTitle = 0
        const names = getScientificNames(node.names)
        for (const name of names) {
            const response = await axios.get<PBDBResponse>(
                `https://paleobiodb.org/data1.2/taxa/list.json?name=${encodeURIComponent(
                    [...ancestorTitles, name].join(":"),
                )}&rel=synonyms`,
            )
            if (response.data.records.length > 0) {
                for (const record of response.data.records) {
                    const oid = record.oid.replace(/^txn:/, "")
                    const childrenResponse = await axios.get<PBDBResponse>(
                        `https://paleobiodb.org/data1.2/taxa/list.json?id=${encodeURIComponent(
                            record.oid,
                        )}&rel=children`,
                    )
                    if (childrenResponse.data.records.length > numChildrenForTitle) {
                        numChildrenForTitle = childrenResponse.data.records.length
                        title = record.nam
                    }
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
    if (title && ANCESTOR_TITLE_BLOCK_LIST.includes(title)) {
        title = undefined
    }
    const promises: Array<Promise<void>> = []
    for await (const child of iterateList(client.node(node.uuid).children)) {
        promises.push(processNode(client, child, title ? [...ancestorTitles, title] : ancestorTitles))
    }
    await Promise.all(promises)
}
const autolinkPBDB = async (client: SourceClient): Promise<void> => {
    const node = await client.root.get()
    await processNode(client, node, [])
}
export default autolinkPBDB
