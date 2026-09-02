import { rmSync } from "fs"
import { getEntitiesStagingBuildDir, ENTITIES_STAGING_ROOT } from "./EntityS3Writer.js"

export const cleanEntitiesStaging = (build: number) => {
    console.info(`Removing local entity staging for build ${build}...`)
    rmSync(getEntitiesStagingBuildDir(build), { force: true, recursive: true })
    console.info(`Removed local entity staging for build ${build}.`)
}

export const cleanEntitiesStagingRoot = () => {
    rmSync(ENTITIES_STAGING_ROOT, { force: true, recursive: true })
}
