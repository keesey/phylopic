import { normalizeQuery, TitledLink } from "@phylopic/api-models"
import { Contributor } from "@phylopic/source-models"
import {
    chunk,
    compareStrings,
    LicenseURL,
    shortenNomen,
    stringifyNomen,
    stringifyNormalized,
    UUID,
} from "@phylopic/utils"
import type { NomenPart } from "parse-nomen"
import type { ClientBase, QueryConfig } from "pg"
import { cleanEntitiesStaging } from "../entities/cleanEntitiesStaging.js"
import { EntityS3Writer } from "../entities/EntityS3Writer.js"
import { cleanEntitiesS3 } from "../entities/cleanEntitiesS3.js"
import { cleanTables } from "./cleanEntities.js"
import getContributorJSON from "./getContributorJSON.js"
import getAuthorizedNamespaces from "./getAuthorizedNamespaces.js"
import getResolveObjectJSONEntries from "./getResolveObjectJSONEntries.js"
import {
    getContributorListJSONUploads,
    getImageListJSONUploads,
    getNodeListJSONUploads,
    queueAllLineageJSONUploads,
} from "./getListJSONUploads.js"
import getImageJSON from "./getImageJSON.js"
import getNodeJSON from "./getNodeJSON.js"
import type { SourceData } from "./getSourceData.js"
const MINIMUM_SEARCH_TEXT_LENGTH = 2
interface NodeQueryConfigs {
    readonly externals: QueryConfig
    readonly names: QueryConfig
    readonly nodes: QueryConfig
}
const getNormalizedName = (name: readonly NomenPart[]) => {
    const normalized = normalizeQuery(
        name
            .filter(part => part.class === "scientific" || part.class === "vernacular")
            .map(({ text }) => text)
            .join(" "),
    )
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
const processNode = (data: SourceData, nodeUUID: UUID, queryConfigs: NodeQueryConfigs) => {
    const node = data.nodes.get(nodeUUID)
    if (!node) {
        throw new Error(`Cannot find node! (UUID=${nodeUUID})`)
    }
    if (!queryConfigs.nodes.values) {
        throw new Error("No values array!")
    }
    const json = getNodeJSON(nodeUUID, data)
    const jsonString = stringifyNormalized(json)
    let index = queryConfigs.nodes.values.length + 1
    queryConfigs.nodes.text += index === 1 ? " " : ","
    queryConfigs.nodes.text += `($${index++}::uuid,$${index++}::bigint,$${index++}::uuid,$${index++}::bigint,$${index++}::text,$${index++}::character varying)`
    const titleNomen = data.nodes.get(nodeUUID)?.names[0]
    queryConfigs.nodes.values.push(
        nodeUUID,
        data.build,
        node.parent ?? null,
        data.sortIndices.get(nodeUUID) ?? 0,
        jsonString,
        titleNomen ? stringifyNomen(shortenNomen(titleNomen)) : null,
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
const insertNodes = async (client: ClientBase, data: SourceData, isDryRun: boolean) => {
    console.info("Adding node data to entities database...")
    const sorted = [...data.nodes.keys()].sort(
        (a, b) => (data.depths.get(a) ?? 0) - (data.depths.get(b) ?? 0) || (a < b ? -1 : b < a ? 1 : 0),
    )
    const chunks = chunk(sorted, 500)
    for (const c of chunks) {
        const nodes: QueryConfig = {
            text: 'INSERT INTO node ("uuid",build,parent_uuid,sort_index,json,title) VALUES',
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
        c.forEach(nodeUUID => processNode(data, nodeUUID, configs))
        if (!isDryRun) {
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
    }
    console.info("Added node data to entities database.")
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
const insertImages = async (client: ClientBase, data: SourceData, isDryRun = false) => {
    console.info("Adding image data to entities database...")
    if (!isDryRun && data.images.size > 0) {
        const chunks = chunk(data.images.entries(), 1024)
        for (const c of chunks) {
            const config: QueryConfig = {
                text: 'INSERT INTO image ("uuid",build,contributor_uuid,created,depth,license_by,license_nc,license_sa,modified,modified_file,json,title,unlisted) VALUES',
                values: [],
            }
            if (!config.values) {
                throw new Error("No values array!")
            }
            let index = 1
            for (const [uuid, image] of c) {
                const titleNomen = data.nodes.get(image.specific)?.names[0]
                const jsonString = stringifyNormalized(await getImageJSON(uuid, data))
                config.text += index === 1 ? " " : ","
                config.text += `($${index++}::uuid,$${index++}::bigint,$${index++}::uuid,$${index++}::timestamp without time zone,$${index++}::bigint,$${index++}::bit,$${index++}::bit,$${index++}::bit,$${index++}::timestamp without time zone,$${index++}::timestamp without time zone,$${index++}::text,$${index++}::character varying,$${index++}::bit)`
                config.values.push(
                    uuid,
                    data.build,
                    image.contributor,
                    image.created,
                    data.depths.get(image.general ?? image.specific!) ?? 0,
                    isBy(image.license) ? 1 : 0,
                    isNC(image.license) ? 1 : 0,
                    isSA(image.license) ? 1 : 0,
                    image.modified,
                    data.filesModified.get(uuid) ?? image.modified,
                    jsonString,
                    titleNomen ? stringifyNomen(shortenNomen(titleNomen)) : null,
                    image.unlisted ? 1 : 0,
                )
            }
            await tryQuery(client, config)
        }
    }
    console.info("Added image data to entities database.")
}
const getContributorCount = (data: SourceData, uuid: UUID): number => {
    return [...data.images.values()].filter(({ contributor, unlisted }) => !unlisted && contributor === uuid).length
}
const compareContributorEntries = (
    a: Readonly<[UUID, Contributor, number]>,
    b: Readonly<[UUID, Contributor, number]>,
) => b[2] - a[2] || compareStrings(a[1].created, b[1].created) || compareStrings(a[0], b[0])
const insertContributors = async (
    client: ClientBase,
    data: SourceData,
    isDryRun = false,
) => {
    console.info("Adding contributor data to entities database...")
    const contributors = [...data.contributors.entries()]
        .map(
            ([uuid, contributor]) =>
                [uuid, contributor, getContributorCount(data, uuid)] as Readonly<[UUID, Contributor, number]>,
        )
        .sort(compareContributorEntries)
    if (!isDryRun && contributors.length > 0) {
        const chunks = chunk(contributors, 1024)
        let sortIndex = 0
        for (const c of chunks) {
            const config: QueryConfig = {
                text: 'INSERT INTO contributor ("uuid",build,created,json,sort_index,title,unlisted) VALUES',
                values: [],
            }
            if (!config.values) {
                throw new Error("No values array!")
            }
            let index = 1
            for (const [uuid, contributor, count] of c) {
                const jsonString = stringifyNormalized(getContributorJSON(uuid, data, count))
                config.text += index === 1 ? " " : ","
                config.text += `($${index++}::uuid,$${index++}::bigint,$${index++}::timestamp without time zone,$${index++}::text,$${index++}::bigint,$${index++}::character varying,$${index++}::bit)`
                config.values.push(
                    uuid,
                    data.build,
                    contributor.created,
                    jsonString,
                    sortIndex++,
                    contributor.name || null,
                    count > 0 ? 0 : 1,
                )
            }
            await tryQuery(client, config)
        }
    }
    console.info("Added contributor data to entities database.")
}
const insertContributorsAndImages = async (
    client: ClientBase,
    data: SourceData,
    isDryRun = false,
) => {
    await insertContributors(client, data, isDryRun)
    await insertImages(client, data, isDryRun)
}
const insertIllustrations = async (client: ClientBase, data: SourceData, isDryRun = false) => {
    console.info("Adding image-node assigments to entities database...")
    if (!isDryRun && data.illustration.size > 0) {
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
    console.info("Added image-node assigments to entities database.")
}
const writeEntityJSON = (data: SourceData, s3Writer: EntityS3Writer) => {
    console.info("Staging list, lineage, resolve, and namespace JSON (parallel with database)...")
    s3Writer.putStatic(
        "namespaces",
        stringifyNormalized({
            build: data.build,
            namespaces: getAuthorizedNamespaces(data),
        }),
    )
    for (const { authority, body, namespace, objectID } of getResolveObjectJSONEntries(data)) {
        s3Writer.putResolve(authority, namespace, objectID, body)
    }
    console.info("Queued resolve object JSON for local staging.")
    for (const upload of getContributorListJSONUploads(data)) {
        s3Writer.put(upload.key, upload.body)
    }
    console.info("Queued contributor list JSON for local staging.")
    for (const upload of getNodeListJSONUploads(data)) {
        s3Writer.put(upload.key, upload.body)
    }
    console.info("Queued node list JSON for local staging.")
    for (const upload of getImageListJSONUploads(data)) {
        s3Writer.put(upload.key, upload.body)
    }
    console.info("Queued image list JSON for local staging.")
    queueAllLineageJSONUploads(data, upload => s3Writer.put(upload.key, upload.body))
    console.info("Queued node lineage JSON for local staging.")
}

const insertEntities = async (client: ClientBase, data: SourceData, isDryRun = false) => {
    console.info("Updating entities database...")
    const s3Writer = isDryRun ? undefined : new EntityS3Writer(data.build)
    // Clean anything from an aborted build.
    if (!isDryRun) {
        cleanEntitiesStaging(data.build)
        await Promise.all([
            cleanTables(client, data.build, "="),
            cleanEntitiesS3(data.build, "="),
        ])
    }
    await Promise.all([
        (async () => {
            await client.query("BEGIN")
            await Promise.all([
                insertContributorsAndImages(client, data, isDryRun),
                insertNodes(client, data, isDryRun),
            ])
            await insertIllustrations(client, data, isDryRun)
            await client.query(isDryRun ? "ROLLBACK" : "COMMIT")
            console.info("Updated entities database.")
        })(),
        s3Writer ? (async () => {
            writeEntityJSON(data, s3Writer)
            await s3Writer.flush()
            console.info("Staged entity JSON locally.")
        })() : Promise.resolve(),
    ])
}
export default insertEntities
