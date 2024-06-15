import "dotenv/config"
import SourceClient from "./source/SourceClient.js"
import { normalizeNomina, stringifyNomen } from "@phylopic/utils"
;(async () => {
    const client = new SourceClient()
    try {
        console.info("PhyloPic Normalize starting...")
        const totalPages = await client.nodes.totalPages()
        await Promise.all(
            new Array(totalPages).fill(null).map(async (_, index) => {
                const page = await client.nodes.page(index)
                await Promise.all(
                    page.items.map(async node => {
                        const original = JSON.stringify(node.names)
                        const normalized = normalizeNomina(node.names)
                        if (original !== JSON.stringify(normalized)) {
                            console.info("Normalizing:", stringifyNomen(normalized[0]), `(${node.uuid})`)
                            await client.node(node.uuid).patch({
                                names: normalized,
                            })
                        }
                    }),
                )
            }),
        )
    } catch (e) {
        console.error(e)
        process.exit(1)
    } finally {
        await client.destroy()
    }
    console.info("PhyloPic Normalize complete.")
    process.exit(0)
})()
