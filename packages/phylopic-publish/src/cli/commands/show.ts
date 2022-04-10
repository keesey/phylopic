import { Entity, Image, Node } from "phylopic-source-models/src"
import { ClientData } from "../getClientData"
import { CommandResult } from "./CommandResult"
import getLineage from "./utils/getLineage"
import precedes from "./utils/precedes"
const show = (clientData: ClientData, entity: Entity<Image | Node>): CommandResult => {
    console.info("--------------------------------------------------------------------------------")
    console.info(JSON.stringify(entity, undefined, "\t"))
    console.info("--------------------------------------------------------------------------------")
    if (clientData.images.has(entity.uuid)) {
        const image = clientData.images.get(entity.uuid)
        if (image) {
            const { specific, general } = image
            if (!general) {
                console.info(`Image identified as node:\n\t- ${specific}`)
            } else if (!precedes(clientData.nodes, general, specific)) {
                console.warn("Image has invalid lineage!")
            } else {
                const lineage = getLineage(clientData.nodes, specific, general)
                console.info("Image identified as lineage:")
                lineage.forEach(({ uuid }) => console.info(`\t- ${uuid}`))
            }
        }
    }
    if (clientData.nodes.has(entity.uuid)) {
        const children = [...clientData.nodes.entries()].filter(([, node]) => node.parent === entity.uuid)
        console.info(
            `Node has ${children.length} child${children.length === 1 ? "" : "ren"}${children.length ? ":" : "."}`,
        )
        children.forEach(([uuid]) => console.info(`\t- ${uuid}`))
        const externalEntries = [...clientData.externals.entries()].filter(([, link]) => link.uuid === entity.uuid)
        console.info(
            `Node has ${externalEntries.length} external identifier${externalEntries.length === 1 ? "" : "s"}${
                externalEntries.length ? ":" : "."
            }`,
        )
        externalEntries.forEach(([path, { title }]) => console.info(`\t- <${path}> ${JSON.stringify(title)}`))
    }
    return { clientData, sourceUpdates: [] }
}
export default show
