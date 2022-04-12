import { PutObjectCommand } from "@aws-sdk/client-s3"
import { TitledLink } from "phylopic-api-models/src"
import { Entity, Node } from "phylopic-source-models"
import { Identifier } from "phylopic-utils/src/models"
import { stringifyNomen } from "phylopic-utils/src/nomina"
import { CLIData } from "../getCLIData"
import { CommandResult } from "./CommandResult"
const link = (clientData: CLIData, identifier: Identifier, entity: Entity<Node>, title?: string): CommandResult => {
    const existing = clientData.externals.get(identifier)
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
        title = stringifyNomen(entity.value.names[0])
    }
    const newValue = { uuid: entity.uuid, title }
    externals.set(identifier, newValue)
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
                Key: `externals/${identifier}/meta.json`,
            }),
        ],
    }
}
export default link
