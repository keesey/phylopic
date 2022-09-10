import "dotenv/config"
import SourceClient from "./source/SourceClient.js"
;(async () => {
    const client = new SourceClient()
    try {
        console.info("PhyloPic AutoLink starting...")
        if (process.argv.length < 2) {
            console.info("Valid options: eol otol pbdb")
        } else {
            for (const option of process.argv.slice(2)) {
                switch (option) {
                    case "eol": {
                        console.info("Auto-linking Encyclopedia of Life.")
                        const linker = await import("./autolink/eol.js")
                        await linker.default(client)
                        break
                    }
                    case "otol": {
                        console.info("Auto-linking Open Tree of Life.")
                        const linker = await import("./autolink/otol.js")
                        await linker.default(client)
                        break
                    }
                    case "pbdb": {
                        console.info("Auto-linking Paleobiology Database.")
                        const linker = await import("./autolink/pbdb.js")
                        await linker.default(client)
                        break
                    }
                }
            }
        }
    } catch (e) {
        console.error(e)
        process.exit(1)
    } finally {
        await client.destroy()
    }
    console.info("PhyloPic AutoLink complete.")
    process.exit(0)
})()
