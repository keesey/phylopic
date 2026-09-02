import { execFile } from "child_process"
import { readFile } from "fs/promises"
import { join } from "path"
import { promisify } from "util"
import { ENTITIES_BUCKET, ENTITIES_CACHE_CONTROL } from "./entities/constants.js"
import { getEntitiesStagingBuildDir, ENTITIES_STAGING_ROOT } from "./entities/EntityS3Writer.js"

const execFileAsync = promisify(execFile)

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
    await execFileAsync(
        "aws",
        ["s3", "sync", source, destination, "--sse", "AES256", "--cache-control", ENTITIES_CACHE_CONTROL],
        { env: process.env },
    )
    console.info(`Uploaded entity JSON for build ${build}.`)
}

export default uploadEntities
