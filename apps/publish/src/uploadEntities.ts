import { spawn } from "child_process"
import { readFile } from "fs/promises"
import { join } from "path"
import { ENTITIES_BUCKET } from "@phylopic/s3-entities"
import { ENTITIES_CACHE_CONTROL, ENTITIES_STAGING_ROOT } from "./entities/constants.js"
import { getEntitiesStagingBuildDir } from "./entities/EntityS3Writer.js"

const runCommand = (command: string, args: readonly string[]) =>
    new Promise<void>((resolve, reject) => {
        const child = spawn(command, args, { env: process.env, stdio: "inherit" })
        child.on("error", reject)
        child.on("close", code => {
            if (code === 0) {
                resolve()
                return
            }
            reject(new Error(`${command} ${args.join(" ")} exited with code ${code ?? "unknown"}.`))
        })
    })

const readStagingBuild = async () => {
    const build = Number.parseInt(await readFile(join(ENTITIES_STAGING_ROOT, ".staging-build"), "utf8"), 10)
    if (Number.isNaN(build)) {
        throw new Error("Invalid build number in .staging-build.")
    }
    return build
}

const uploadEntities = async (buildArg?: number) => {
    const build = buildArg ?? (await readStagingBuild())
    const source = getEntitiesStagingBuildDir(build)
    const destination = `s3://${ENTITIES_BUCKET}/${build}/`
    console.info(`Uploading entity JSON from ${source} to ${destination}...`)
    await runCommand("aws", [
        "s3",
        "sync",
        source,
        destination,
        "--sse",
        "AES256",
        "--cache-control",
        ENTITIES_CACHE_CONTROL,
    ])
    console.info(`Uploaded entity JSON for build ${build}.`)
}

export default uploadEntities
