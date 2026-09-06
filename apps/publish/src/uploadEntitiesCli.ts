import "dotenv/config"
import uploadEntities from "./uploadEntities.js"

;(async () => {
    try {
        const buildArg = Number.parseInt(process.argv[2] ?? "", 10)
        await uploadEntities(Number.isNaN(buildArg) ? undefined : buildArg)
        process.exit(0)
    } catch (e) {
        console.error(e)
        process.exit(1)
    }
})()
