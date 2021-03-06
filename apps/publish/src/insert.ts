import "dotenv/config"
import pg from "pg"
import getBuild from "./make/getBuild.js"
import getSourceData from "./make/getSourceData.js"
import insertEntities from "./make/insertEntities.js"
;(async () => {
    try {
        const build = (await getBuild()) + 1
        console.info("Inserting entities for build:", build)
        console.info("Loading source data...")
        const sourceData = await getSourceData({ build })
        console.info("Loaded source data.")
        await (async () => {
            const client = new pg.Client({
                database: "phylopic-entities",
            })
            try {
                await client.connect()
                await insertEntities(client, sourceData)
            } finally {
                client.end()
            }
        })()
        console.info("Inserted all entities for build:", build)
        process.exit(0)
    } catch (e) {
        console.info("ERROR!")
        console.error(e)
        process.exit(1)
    }
})()
