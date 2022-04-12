import { normalizeSync as normalizeDiacritics } from "normalize-diacritics"
import type { NomenPart } from "parse-nomen"
import type { ClientBase, QueryConfig } from "pg"
import { TitledLink } from "phylopic-api-models/src"
import { LicenseURL, UUID } from "phylopic-utils/src/models"
import { chunk } from "phylopic-utils/src/processing"
import { cleanTables } from "./cleanEntities"
import getImageJSON from "./getImageJSON"
import getNodeJSON from "./getNodeJSON"
import type { SourceData } from "./getSourceData"
const MINIMUM_SEARCH_TEXT_LENGTH = 2
interface NodeQueryConfigs {
    readonly externals: QueryConfig
    readonly names: QueryConfig
    readonly nodes: QueryConfig
}
const getNormalizedName = (name: readonly NomenPart[]) => {
    const normalized = normalizeDiacritics(
        name
            .filter(part => part.class === "scientific" || part.class === "vernacular")
            .map(({ text }) => text)
            .join(" "),
    )
        .toLowerCase()
        .replaceAll(/\s+/g, " ")
        .replaceAll(/[^a-z -]+/g, " ")
        .trim()
        .replaceAll(/\s+/g, " ")
    if (normalized.length <= MINIMUM_SEARCH_TEXT_LENGTH) {
        return ""
    }
    return normalized
}
const processNodeNames = (
    build: number,
    nodeUUID: UUID,
    names: readonly (readonly NomenPart[])[],
    queryConfig: QueryConfig,
) => {
    if (!queryConfig.values) {
        throw new Error("No values array!")
    }
    let index = queryConfig.values.length + 1
    const normalizedNames = [...new Set(names.map(getNormalizedName))].filter(Boolean).sort()
    for (const normalizedName of normalizedNames) {
        queryConfig.text += index === 1 ? " " : ","
        queryConfig.text += `($${index++}::character varying,$${index++}::uuid,$${index++}::bigint)`
        queryConfig.values.push(normalizedName, nodeUUID, build)
    }
}
const processNodeExternals = (
    build: number,
    nodeUUID: string,
    externals: [string, TitledLink][],
    queryConfig: QueryConfig,
) => {
    if (!queryConfig.values) {
        throw new Error("No values array!")
    }
    let index = queryConfig.values.length + 1
    for (const [identifier, link] of externals) {
        const [authority, namespace, objectID] = identifier.split("/", 3).map(decodeURIComponent)
        queryConfig.text += index === 1 ? " " : ","
        queryConfig.text += `($${index++}::character varying,$${index++}::character varying,$${index++}::character varying,$${index++}::bigint,$${index++}::uuid,$${index++}::character varying)`
        queryConfig.values.push(authority, namespace, objectID, build, nodeUUID, link.title)
    }
}
const processNode = async (data: SourceData, nodeUUID: UUID, queryConfigs: NodeQueryConfigs) => {
    const node = data.nodes.get(nodeUUID)
    if (!node) {
        throw new Error(`Cannot find node! (UUID=${nodeUUID})`)
    }
    if (!queryConfigs.nodes.values) {
        throw new Error("No values array!")
    }
    const json = await getNodeJSON(nodeUUID, data)
    let index = queryConfigs.nodes.values.length + 1
    queryConfigs.nodes.text += index === 1 ? " " : ","
    queryConfigs.nodes.text += `($${index++}::uuid,$${index++}::bigint,$${index++}::uuid,$${index++}::bigint,$${index++}::text)`
    queryConfigs.nodes.values.push(
        nodeUUID,
        data.build,
        node.parent ?? null,
        data.sortIndices.get(nodeUUID) ?? 0,
        JSON.stringify(json),
    )
    processNodeNames(data.build, nodeUUID, node.names, queryConfigs.names)
    const nodeHRef = `/nodes/${nodeUUID}`
    const externals = [...data.externals.entries()].filter(([, { href }]) => href === nodeHRef)
    processNodeExternals(data.build, nodeUUID, externals, queryConfigs.externals)
}
const tryQuery = async <T extends unknown[]>(client: ClientBase, config: QueryConfig<T>) => {
    try {
        return await client.query(config)
    } catch (e) {
        console.warn("Query failed.", config)
        throw e
    }
}
const insertNodes = async (client: ClientBase, data: SourceData) => {
    console.info("Adding node data to search database...")
    const sorted = [...data.nodes.keys()].sort(
        (a, b) => (data.depths.get(a) ?? 0) - (data.depths.get(b) ?? 0) || (a < b ? -1 : b < a ? 1 : 0),
    )
    const chunks = chunk(sorted, 500)
    for (const c of chunks) {
        const nodes: QueryConfig = {
            text: 'INSERT INTO node ("uuid",build,parent_uuid,sort_index,json) VALUES',
            values: [],
        }
        const names: QueryConfig = {
            text: "INSERT INTO node_name (normalized,node_uuid,build) VALUES",
            values: [],
        }
        const externals: QueryConfig = {
            text: 'INSERT INTO node_external (authority,"namespace",objectid,build,node_uuid,title) VALUES',
            values: [],
        }
        const configs = { externals, names, nodes }
        await Promise.all(c.map(nodeUUID => processNode(data, nodeUUID, configs)))
        if (nodes.values?.length) {
            await tryQuery(client, nodes)
        }
        if (names.values?.length) {
            await tryQuery(client, names)
        }
        if (externals.values?.length) {
            await tryQuery(client, externals)
        }
    }
    console.info("Added node data to search database.")
}
const isBy = (license: LicenseURL) =>
    license !== "https://creativecommons.org/publicdomain/mark/1.0/" &&
    license !== "https://creativecommons.org/publicdomain/zero/1.0/"
const isNC = (license: LicenseURL) =>
    license === "https://creativecommons.org/licenses/by-nc-sa/3.0/" ||
    license === "https://creativecommons.org/licenses/by-nc/3.0/"
const isSA = (license: LicenseURL) =>
    license === "https://creativecommons.org/licenses/by-nc-sa/3.0/" ||
    license === "https://creativecommons.org/licenses/by-sa/3.0/"
const insertImages = async (client: ClientBase, data: SourceData) => {
    console.info("Adding image data to search database...")
    if (data.images.size > 0) {
        const chunks = chunk(data.images.entries(), 1024)
        for (const c of chunks) {
            const config: QueryConfig = {
                text: 'INSERT INTO image ("uuid",build,contributor,depth,license_by,license_nc,license_sa,created,json) VALUES',
                values: [],
            }
            if (!config.values) {
                throw new Error("No values array!")
            }
            let index = 1
            for (const [uuid, image] of c) {
                config.text += index === 1 ? " " : ","
                config.text += `($${index++}::uuid,$${index++}::bigint,$${index++}::character varying,$${index++}::bigint,$${index++}::bit,$${index++}::bit,$${index++}::bit,$${index++}::timestamp without time zone,$${index++}::text)`
                config.values.push(
                    uuid,
                    data.build,
                    image.contributor,
                    data.depths.get(image.general ?? image.specific) ?? 0,
                    isBy(image.license) ? 1 : 0,
                    isNC(image.license) ? 1 : 0,
                    isSA(image.license) ? 1 : 0,
                    image.created,
                    JSON.stringify(await getImageJSON(uuid, data)),
                )
            }
            await tryQuery(client, config)
        }
    }
    console.info("Added image data to search database.")
}
const insertIllustrations = async (client: ClientBase, data: SourceData) => {
    console.info("Adding image-node assigments to search database...")
    if (data.illustration.size > 0) {
        const chunks = chunk(data.illustration.entries(), 1024)
        for (const c of chunks) {
            const config: QueryConfig = {
                text: "INSERT INTO image_node (node_uuid,build,image_uuid) VALUES",
                values: [],
            }
            let index = 1
            if (!config.values) {
                throw new Error("No values array!")
            }
            for (const [imageUUID, nodeUUIDs] of c) {
                for (const nodeUUID of nodeUUIDs) {
                    config.text += index === 1 ? " " : ","
                    config.text += `($${index++}::uuid,$${index++}::bigint,$${index++}::uuid)`
                    config.values.push(nodeUUID, data.build, imageUUID)
                }
            }
            await tryQuery(client, config)
        }
    }
    console.info("Added image-node assigments to search database...")
}
const updateEntities = async (client: ClientBase, data: SourceData) => {
    console.info("Updating search database...")
    // Clean anything from an aborted build.
    await cleanTables(client, data.build, "=")
    await client.query("BEGIN")
    // Insert entities and adjunct data
    await Promise.all([insertImages(client, data), insertNodes(client, data)])
    // Insert node-image links
    await insertIllustrations(client, data)
    await client.query("COMMIT")
    console.info("Updated search database.")
}
export default updateEntities
