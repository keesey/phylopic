import { PutObjectCommand } from "@aws-sdk/client-s3"
import { TitledLink } from "phylopic-api-models/src"
import { Entity, Node } from "phylopic-source-models/src"
import { Identifier, stringifyNomen } from "phylopic-utils/src"
import { CLIData } from "../getCLIData"
import { CommandResult } from "./CommandResult"
const link = (cliData: CLIData, identifier: Identifier, entity: Entity<Node>, title?: string): CommandResult => {
    const existing = cliData.externals.get(identifier)
    if (existing) {
        if (existing.uuid === entity.uuid) {
            console.warn("No change required.")
            return {
                cliData,
                sourceUpdates: [],
            }
        }
        console.warn(`Overwriting previous link: ${JSON.stringify(existing)}`)
    }
    const externals = new Map(cliData.externals.entries())
    if (!title) {
        title = stringifyNomen(entity.value.names[0])
    }
    const newValue = { uuid: entity.uuid, title }
    externals.set(identifier, newValue)
    const newLink: TitledLink = { href: `/nodes/${encodeURIComponent(entity.uuid)}`, title }
    return {
        cliData: {
            ...cliData,
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
