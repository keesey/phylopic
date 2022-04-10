import { PutObjectCommand } from "@aws-sdk/client-s3"
import { TitledLink } from "phylopic-api-models/src"
import { Entity, Identifier, Node } from "phylopic-source-models/src"
import { ClientData } from "../getClientData"
import { CommandResult } from "./CommandResult"
const link = (clientData: ClientData, identifier: Identifier, entity: Entity<Node>, title?: string): CommandResult => {
    const key = identifier.map(encodeURIComponent).join("/")
    const existing = clientData.externals.get(key)
    if (existing) {
        if (existing.uuid === entity.uuid) {
            console.warn("No change required.")
            return {
                clientData,
                sourceUpdates: [],
            }
        }
        console.warn(`Overwriting previous link: ${JSON.stringify(existing)}`)
    }
    const externals = new Map(clientData.externals.entries())
    if (!title) {
        title = entity.value.names[0].map(({ text }) => text).join(" ")
    }
    const newValue = { uuid: entity.uuid, title }
    externals.set(key, newValue)
    const newLink: TitledLink = { href: `/nodes/${encodeURIComponent(entity.uuid)}`, title }
    return {
        clientData: {
            ...clientData,
            externals,
        },
        sourceUpdates: [
            new PutObjectCommand({
                Body: JSON.stringify(newLink),
                Bucket: "source.phylopic.org",
                ContentType: "application/json",
                Key: `externals/${key}/meta.json`,
            }),
        ],
    }
}
export default link
