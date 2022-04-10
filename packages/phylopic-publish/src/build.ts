import "dotenv/config"
import { Client } from "pg"
import { normalizeUUID } from "phylopic-source-models/src"
import getBuild from "./build/getBuild"
import getSourceData from "./build/getSourceData"
import getImageJSON from "./build/getImageJSON"
import getNodeJSON from "./build/getNodeJSON"
import updateEntities from "./build/updateEntities"
import writeJSON from "./fsutils/writeJSON"
    ; (async () => {
        try {
            const build = (await getBuild()) + 1
            console.info("Creating files for build:", build)
            console.info("Loading source data...")
            const sourceData = await getSourceData({ build })
            console.info("Loaded source data.")
            await Promise.all([
                (async () => {
                    console.info(`Processing ${sourceData.images.size} images...`)
                    await Promise.all(
                        [...sourceData.images.keys()].map(async uuid => {
                            const data = await getImageJSON(uuid, sourceData)
                            await writeJSON(`.s3/data.phylopic.org/images/${normalizeUUID(uuid)}/meta.${build}.json`, data)
                        }),
                    )
                    console.info(`Processed ${sourceData.images.size} images.`)
                })(),
                (async () => {
                    console.info(`Processing ${sourceData.nodes.size} nodes...`)
                    await Promise.all(
                        [...sourceData.nodes.keys()].map(async uuid => {
                            const data = await getNodeJSON(uuid, sourceData)
                            await writeJSON(`.s3/data.phylopic.org/nodes/${normalizeUUID(uuid)}/meta.${build}.json`, data)
                        }),
                    )
                    console.info(`Processed ${sourceData.nodes.size} nodes.`)
                })(),
            ])
            await (async () => {
                const client = new Client({
                    database: "phylopic-search",
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
