import listDir from "../fsutils/listDir.js"
import { IMAGES_PUBLISH_MIRROR } from "../make/imagesPublishMirror.js"
import {
    DERIVATIVE_FOLDERS,
    DERIVATIVES_MANIFEST_FILENAME,
    pruneUnlistedDerivatives,
    readDerivativesManifest,
    writeDerivativesManifestFromMirror,
} from "./derivativesManifest.js"
import { readProcessQueue } from "./processQueue.js"

;(async () => {
    try {
        const queued = await readProcessQueue()
        for (const uuid of queued) {
            const manifest = await writeDerivativesManifestFromMirror(uuid)
            const empty = DERIVATIVE_FOLDERS.filter(folder => manifest[folder].length === 0)
            if (empty.length > 0) {
                console.warn(`Image <${uuid}> has no derivative files in: ${empty.join(", ")}.`)
            }
        }
        console.info(`Wrote ${DERIVATIVES_MANIFEST_FILENAME} for ${queued.length} processed image(s).`)

        let pruned = 0
        const missing: string[] = []
        for (const uuid of await listDir(IMAGES_PUBLISH_MIRROR)) {
            const manifest = await readDerivativesManifest(uuid)
            if (manifest === null) {
                missing.push(uuid)
                continue
            }
            pruned += await pruneUnlistedDerivatives(uuid, manifest)
        }
        console.info(`Pruned ${pruned} unlisted derivative file(s) from the publish mirror.`)
        if (missing.length > 0) {
            console.warn(`${missing.length} image(s) have no ${DERIVATIVES_MANIFEST_FILENAME}: ${missing.join(", ")}`)
        }
        process.exit(0)
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
})()
