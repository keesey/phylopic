import { DeleteObjectCommand } from "@aws-sdk/client-s3"
import { SOURCE_BUCKET_NAME } from "@phylopic/source-models"
import { Identifier } from "@phylopic/utils"
import { CLIData } from "../getCLIData"
import { CommandResult } from "./CommandResult"
const unlink = (cliData: CLIData, identifier: Identifier): CommandResult => {
    if (!cliData.externals.has(identifier)) {
        console.warn("No external with that identifier.")
        return {
            cliData,
            sourceUpdates: [],
        }
    }
    const externals = new Map(cliData.externals.entries())
    externals.delete(identifier)
    return {
        cliData: {
            ...cliData,
            externals,
        },
        sourceUpdates: [
            new DeleteObjectCommand({
                Bucket: SOURCE_BUCKET_NAME,
                Key: `externals/${identifier}/meta.json`,
            }),
        ],
    }
}
export default unlink
