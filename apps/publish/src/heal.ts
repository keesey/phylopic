import { S3Client } from "@aws-sdk/client-s3"
import "dotenv/config"
import * as readline from "readline"
import analyze from "./heal/analyze.js"
import enact from "./heal/enact.js"
import getHealData from "./heal/getHealData.js"
import hasActions from "./heal/hasActions.js"
import logActions from "./heal/logActions.js"
const confirm = () => {
    return new Promise<boolean>(resolve => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: "\n[Y/n] ",
        })
        rl.question("Do you want to make these changes? ", answer => resolve(answer.charAt(0).toLowerCase() === "y"))
    })
}
;(async () => {
    const client = new S3Client({})
    try {
        console.info("PhyloPic Heal")
        console.info("Loading data...")
        const data = analyze(await getHealData(client))
        if (!hasActions(data)) {
            console.info("Nothing to heal. Goodbye!")
        } else {
            logActions(data)
            if (await confirm()) {
                console.info("Making changes...")
                await enact(client, data)
                console.info("Made changes. Goodbye!")
            } else {
                console.info("Skipping changes. Goodbye!")
            }
        }
    } catch (e) {
        console.error(String(e))
        process.exit(1)
    } finally {
        client.destroy()
    }
    process.exit(0)
})()
