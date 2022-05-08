import { S3Client } from "@aws-sdk/client-s3"
import { isSource, Source } from "@phylopic/source-models"
import "dotenv/config"
import { Client } from "pg"
import readJSON from "./fsutils/readJSON"
import cleanEntities from "./make/cleanEntities"
import getBuild from "./make/getBuild"
import updateParameters from "./make/updateParameters"
const SOURCE_PATH = "./.s3/source.phylopic.org/meta.json"
;(async () => {
    const pgClient = new Client({
        database: "phylopic-entities",
    })
    const s3Client = new S3Client({})
    try {
        const [, prevBuild, source] = await Promise.all([
            pgClient.connect(),
            getBuild(),
            readJSON<Source>(SOURCE_PATH, isSource),
        ])
        const build = prevBuild + 1
        console.info("Releasing build", build, "...")
        await updateParameters(build, source.root)
        console.info("Build", build, "released.")
        console.info("Cleaning up entities database...")
        await cleanEntities(pgClient, build)
        console.info("Cleaned up entities database.")
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