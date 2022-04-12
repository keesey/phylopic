import { DeleteObjectCommand } from "@aws-sdk/client-s3"
import { Identifier } from "phylopic-utils/src/models"
import { CLIData } from "../getCLIData"
import { CommandResult } from "./CommandResult"
const unlink = (clientData: CLIData, identifier: Identifier): CommandResult => {
    if (!clientData.externals.has(identifier)) {
        console.warn("No external with that identifier.")
        return {
            clientData,
            sourceUpdates: [],
        }
    }
    const externals = new Map(clientData.externals.entries())
    externals.delete(identifier)
    return {
        clientData: {
            ...clientData,
            externals,
        },
        sourceUpdates: [
            new DeleteObjectCommand({
                Bucket: "source.phylopic.org",
                Key: `externals/${identifier}/meta.json`,
            }),
        ],
    }
}
export default unlink
