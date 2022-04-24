import "dotenv/config"
import { Client } from "pg"
import getBuild from "./make/getBuild"
import getSourceData from "./make/getSourceData"
import updateEntities from "./make/updateEntities"
;(async () => {
    try {
        const build = (await getBuild()) + 1
        console.info("Creating files for build:", build)
        console.info("Loading source data...")
        const sourceData = await getSourceData({ build })
        console.info("Loaded source data.")
        await (async () => {
            const client = new Client({
                database: "phylopic-entities",
            })
            try {
                await client.connect()
                await updateEntities(client, sourceData)
            } finally {
                client.end()
            }
        })()
        console.info("Created all files for build: ", build)
        process.exit(0)
    } catch (e) {
        console.info("ERROR!")
        console.error(e)
        process.exit(1)
    }
})()
