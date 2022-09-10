import { Node } from "@phylopic/source-models"
import { normalizeUUID, UUID } from "@phylopic/utils"
import axios from "axios"
import { randomUUID } from "crypto"
import { parseNomen } from "parse-nomen"
import SourceClient from "~/source/SourceClient"
import { Resolver } from "../Resolver"
interface PBDBRecord {
    // Abridged.
    readonly nam: string
    readonly oid: string
}
const resolveItem = async (client: SourceClient, item: PBDBRecord, lineage: readonly PBDBRecord[]) => {
    const externalClient = client.external("palobiodb.org", "txn", item.oid.replace(/^txn:/, ""))
    if (await externalClient.exists()) {
        const external = await externalClient.get()
        const node = await client.node(external.node).get()
        return node
    }
    const now = new Date().toISOString()
    const parentLineage = [...lineage]
    const parentItem = parentLineage.pop()
    const newNode: Node & { uuid: UUID } = {
        created: now,
        modified: now,
        names: [parseNomen(item.nam)],
        parent: parentItem ? (await resolveItem(client, parentItem, parentLineage)).uuid : null,
        uuid: normalizeUUID(randomUUID()),
    }
    await client.node(newNode.uuid).put(newNode)
    await externalClient.put({
        authority: "palobiodb.org",
        namespace: "txn",
        node: newNode.uuid,
        objectID: String(item.oid.replace(/^txn:/, "")),
        title: item.nam,
    })
    return newNode
}
const resolvePBDB: Resolver = async (client, objectID) => {
    const result = await axios.get<{ records: readonly PBDBRecord[] }>(
        `https://paleobiodb.org/data1.2/taxa/list.json?id=txn:${encodeURIComponent(objectID)}&rel=all_parents`,
    )
    const lineage = [...result.data.records]
    const item = lineage.pop()
    const node = await resolveItem(client, item!, lineage)
    return node
}
export default resolvePBDB
