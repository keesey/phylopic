import { Entity, Image, Node } from "@phylopic/source-models"
import { CLIData } from "../getCLIData.js"
import { CommandResult } from "./CommandResult.js"
import getLineage from "./utils/getLineage.js"
import precedes from "./utils/precedes.js"
const show = (cliData: CLIData, entity: Entity<Image | Node>): CommandResult => {
    console.info("--------------------------------------------------------------------------------")
    console.info(JSON.stringify(entity, undefined, "\t"))
    console.info("--------------------------------------------------------------------------------")
    if (cliData.images.has(entity.uuid)) {
        const image = cliData.images.get(entity.uuid)
        if (image) {
            const { specific, general } = image
            if (!general) {
                console.info(`Image identified as node:\n\t- ${specific}`)
            } else if (!precedes(cliData.nodes, general, specific)) {
                console.warn("Image has invalid lineage!")
            } else {
                const lineage = getLineage(cliData.nodes, specific, general)
                console.info("Image identified as lineage:")
                lineage.forEach(({ uuid }) => console.info(`\t- ${uuid}`))
            }
        }
    }
    if (cliData.nodes.has(entity.uuid)) {
        const children = [...cliData.nodes.entries()].filter(([, node]) => node.parent === entity.uuid)
        console.info(
            `Node has ${children.length} child${children.length === 1 ? "" : "ren"}${children.length ? ":" : "."}`,
        )
        children.forEach(([uuid]) => console.info(`\t- ${uuid}`))
        const externalEntries = [...cliData.externals.entries()].filter(
            ([, link]) => link.href === `/nodes/${entity.uuid}`,
        )
        console.info(
            `Node has ${externalEntries.length} external identifier${externalEntries.length === 1 ? "" : "s"}${
                externalEntries.length ? ":" : "."
            }`,
        )
        externalEntries.forEach(([path, { title }]) => console.info(`\t- <${path}> ${JSON.stringify(title)}`))
    }
    return { cliData, sourceUpdates: [] }
}
export default show
