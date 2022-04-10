import { HealData } from "./getHealData"
const logActions = (data: Pick<HealData, "externalsToPut" | "imagesToPut" | "keysToDelete" | "nodesToPut">) => {
    const images = data.imagesToPut.size
    const deletions = data.keysToDelete.size
    const nodes = data.nodesToPut.size
    const externals = data.externalsToPut.size
    console.info(`${deletions} file${deletions === 1 ? "" : "s"} to delete.`)
    console.info(`${images} image${images === 1 ? "" : "s"} to update metadata for.`)
    console.info(`${nodes} node${nodes === 1 ? "" : "s"} to update metadata for.`)
    console.info(`${externals} external identifier${externals === 1 ? "" : "s"} to update metadata for.`)
}
export default logActions
