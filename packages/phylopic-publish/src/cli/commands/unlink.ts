import { DeleteObjectCommand } from "@aws-sdk/client-s3"
import { Identifier } from "phylopic-utils"
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
                Bucket: "source.phylopic.org",
                Key: `externals/${identifier}/meta.json`,
            }),
        ],
    }
}
export default unlink
