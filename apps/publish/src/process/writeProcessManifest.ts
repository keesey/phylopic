import { writeProcessManifestFromMirror } from "./processManifest.js"

;(async () => {
    try {
        const manifest = await writeProcessManifestFromMirror()
        const count = Object.keys(manifest.images).length
        console.info(`Wrote process manifest for ${count} image(s).`)
        process.exit(0)
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
})()
