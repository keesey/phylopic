import { PutObjectCommand } from "@aws-sdk/client-s3"
import { TitledLink } from "@phylopic/api-models"
import { Entity, Node, SOURCE_BUCKET_NAME } from "@phylopic/source-models"
import { Identifier, stringifyNomen, stringifyNormalized } from "@phylopic/utils"
import { CLIData } from "../getCLIData.js"
import { CommandResult } from "./CommandResult.js"
const link = (cliData: CLIData, identifier: Identifier, entity: Entity<Node>, title?: string): CommandResult => {
    const existing = cliData.externals.get(identifier)
    if (existing) {
        if (existing.href === `/nodes/${entity.uuid}`) {
            console.warn("No change required.")
            return {
                cliData,
                sourceUpdates: [],
            }
        }
        console.warn(`Overwriting previous link: ${stringifyNormalized(existing)}`)
    }
    const externals = new Map(cliData.externals.entries())
    if (!title) {
        title = stringifyNomen(entity.value.names[0])
    }
    const newLink: TitledLink = { href: `/nodes/${encodeURIComponent(entity.uuid)}`, title }
    externals.set(identifier, newLink)
    return {
        cliData: {
            ...cliData,
            externals,
        },
        sourceUpdates: [
            new PutObjectCommand({
                Body: stringifyNormalized(newLink),
                Bucket: SOURCE_BUCKET_NAME,
                ContentType: "application/json",
                Key: `externals/${identifier}/meta.json`,
            }),
        ],
    }
}
export default link
