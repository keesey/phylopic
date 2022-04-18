import { S3Client } from "@aws-sdk/client-s3"
import "dotenv/config"
import * as readline from "readline"
import getCLIData, { CLIData } from "./cli/getCLIData"
import parseCommand, { QUIT } from "./cli/parseCommand"
const takeCommands = (client: S3Client, data: CLIData) =>
    new Promise<void>(resolve => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: "\n> ",
            terminal: true,
        })
        rl.on("close", resolve)
        rl.on("line", async line => {
            try {
                const command = parseCommand(data, line, { s3Client: client })
                if (command === QUIT) {
                    rl.close()
                } else {
                    if (command) {
                        const { cliData, sourceUpdates } = await command()
                        await Promise.all([...sourceUpdates].map(command => client.send(command)))
                        data = cliData
                    }
                    rl.prompt()
                }
            } catch (e) {
                console.error(String(e))
                rl.prompt()
            }
        })
        rl.prompt()
    })
;(async () => {
    const client = new S3Client({})
    try {
        console.info("PhyloPic Client")
        console.info("Loading client data...")
        const cliData = await getCLIData(client)
        console.info("Client data loaded.")
        await takeCommands(client, cliData)
    } catch (e) {
        console.error(String(e))
    } finally {
        client.destroy()
    }
    process.exit(0)
})()
