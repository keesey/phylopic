import "dotenv/config"
import pg from "pg"
import cleanEntities from "./make/cleanEntities.js"
import getBuild from "./make/getBuild.js"
import invalidateAPICache from "./make/invalidateAPICache.js"
import updateParameters from "./make/updateParameters.js"
;(async () => {
    const pgClient = new pg.Client({
        database: "phylopic-entities",
    })
    try {
        const [, prevBuild] = await Promise.all([pgClient.connect(), getBuild()])
        const build = prevBuild + 1
        console.info("Releasing build", build, "...")
        await updateParameters(build /*, source.root*/)
        console.info("Build", build, "released.")
        await Promise.all([
            (async () => {
                console.info("Invalidating API cache...")
                await invalidateAPICache(build)
                console.info("Invalidated API cache.")
            })(),
            (async () => {
                console.info("Cleaning up entities database...")
                await cleanEntities(pgClient, build)
                console.info("Cleaned up entities database.")
            })(),
        ])
    } catch (e) {
        console.info("ERROR!")
        console.error(e)
        process.exit(1)
    } finally {
        await pgClient.end()
    }
    process.exit(0)
})()
