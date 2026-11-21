import { collectQueuedUuidsFromScratch, writeProcessQueue } from "./processQueue.js"

;(async () => {
    try {
        const uuids = await collectQueuedUuidsFromScratch()
        await writeProcessQueue({ uuids })
        console.info(`Wrote process queue for ${uuids.length} image(s).`)
        process.exit(0)
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
})()
