import { DeleteObjectCommand } from "@aws-sdk/client-s3"
import { Identifier } from "phylopic-source-models/src"
import { ClientData } from "../getClientData"
import { CommandResult } from "./CommandResult"
const unlink = (clientData: ClientData, identifier: Identifier): CommandResult => {
    const key = identifier.map(encodeURIComponent).join("/")
    if (!clientData.externals.has(key)) {
        console.warn("No external with that identifier.")
        return {
            clientData,
            sourceUpdates: [],
        }
    }
    const externals = new Map(clientData.externals.entries())
    externals.delete(key)
    return {
        clientData: {
            ...clientData,
            externals,
        },
        sourceUpdates: [
            new DeleteObjectCommand({
                Bucket: "source.phylopic.org",
                Key: `externals/${key}/meta.json`,
            }),
        ],
    }
}
export default unlink
