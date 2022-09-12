// Compares the number of silhouettes to the number of terminal nodes (source: Open Tree of Life)
import { List, Node } from "@phylopic/api-models"
import { isUUIDv4, stringifyNomen } from "@phylopic/utils"
import axios from "axios"
import "dotenv/config"
;(async () => {
    try {
        if (process.argv.length < 2) {
            console.warn("UUID required.")
        } else {
            for (const uuid of process.argv.slice(2)) {
                if (!isUUIDv4(uuid)) {
                    console.warn("Not a value UUID v4:", uuid)
                } else {
                    try {
                        const { data: node } = await axios.get<Node>(`https://api.phylopic.org/nodes/${uuid}`)
                        const otolLink = node._links.external.find(link =>
                            link.href.startsWith("/resolve/opentreeoflife.org/taxonomy/"),
                        )
                        if (!otolLink) {
                            console.warn("Can't find terminal nodes for", stringifyNomen(node.names[0]), `(${uuid}).`)
                        } else if (!node._links.cladeImages) {
                            console.warn("Can't find clade images for", stringifyNomen(node.names[0]), `(${uuid}).`)
                        } else {
                            const ott_id = parseInt(
                                otolLink.href.replace("/resolve/opentreeoflife.org/taxonomy/", "").split("?")[0],
                                10,
                            )
                            const [{ data: cladeImages }, { data: otolTaxon }] = await Promise.all([
                                axios.get<List>("https://api.phylopic.org" + node._links.cladeImages.href),
                                axios.post<{ terminal_descendants: readonly number[] }>(
                                    "https://api.opentreeoflife.org/v3/taxonomy/taxon_info",
                                    { ott_id, include_terminal_descendants: true },
                                ),
                            ])
                            console.info(
                                stringifyNomen(node.names[0]) + ":",
                                cladeImages.totalItems,
                                "images /",
                                otolTaxon.terminal_descendants.length,
                                "terminal nodes (ott_id=" + ott_id + ")",
                                ((100 * cladeImages.totalItems) / otolTaxon.terminal_descendants.length).toFixed(2) +
                                    "%",
                            )
                        }
                    } catch (e) {
                        console.error(e)
                    }
                }
            }
        }
    } catch (e) {
        console.error(e)
        process.exit(1)
    }
    process.exit(0)
})()
