import { S3Client } from "@aws-sdk/client-s3"
import "dotenv/config"
import { Client } from "pg"
import { isSource, Source } from "phylopic-source-models/src"
import readJSON from "./fsutils/readJSON"
import cleanEntities from "./make/cleanEntities"
import getBuild from "./make/getBuild"
import updateParameters from "./make/updateParameters"
;(async () => {
    const pgClient = new Client({
        database: "phylopic-entities",
    })
    const s3Client = new S3Client({})
    try {
        const [, build, source] = await Promise.all([
            pgClient.connect(),
            getBuild(),
            readJSON<Source>("./.s3/source.phylopic.org/meta.json", isSource),
        ])
        console.info("Releasing build ", build, "...")
        await updateParameters(build, source.root)
        console.info("Cleaning up entities database...")
        await cleanEntities(pgClient, build)
        console.info("Cleaned up search.")
        console.info("Build", build, "complete.")
    } catch (e) {
        console.info("ERROR!")
        console.error(e)
        process.exit(1)
    } finally {
        s3Client.destroy()
        pgClient.end()
    }
    process.exit(0)
})()
