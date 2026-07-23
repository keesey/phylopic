import { createAPIFetcher } from "@phylopic/utils-api"
import { type AugmentedPhylogeny } from "../models/AugmentedPhylogeny"
import {
    type Nomen,
    type UUID,
    isUUID,
    normalizeUUID,
    type Identifier,
    type Authority,
    type ObjectID,
    isString,
    normalizeText,
} from "@phylopic/utils"
import normalizeAugmentedPhylogeny from "../normalization/normalizeAugmentedPhylogeny"
import { type Link, type Node, isLink, Page } from "@phylopic/api-models"
import extractUUIDv4 from "~/routes/extractUUIDv4"
import { type BareFetcher } from "swr"
const getNodeUUID = (identifiers: readonly Identifier[]): Identifier | undefined => {
    const identifier = identifiers.find(identifier => identifier.startsWith("phylopic.org/nodes/"))
    if (identifier) {
        const [, , objectID] = identifier.split("/", 3).map(part => decodeURIComponent(part))
        if (isUUID(objectID)) {
            return normalizeUUID(objectID)
        }
    }
}
const getPrimaryImageUUIDForNodeUUID = async (
    uuid: UUID,
    build: number | undefined,
    fetcher: BareFetcher,
): Promise<UUID | null> => {
    const node = (await fetcher(
        `https://api.phylopic.org/nodes/${encodeURIComponent(uuid)}${
            build ? `?build=${encodeURIComponent(build)}` : ""
        }`,
    )) as Node
    return extractUUIDv4(node._links.primaryImage?.href)
}
const getNodeUUIDForNomen = async (
    nomen: Nomen,
    build: number | undefined,
    fetcher: BareFetcher,
): Promise<UUID | null> => {
    const name = nomen.filter(part => part.class === "scientific" || part.class === "vernacular").join(" ")
    if (!name) {
        return null
    }
    // :TODO: Other APIs
    try {
        const page = (await fetcher(
            `https://api.phylopic.org/nodes?}${
                build ? `build=${encodeURIComponent(build)}&` : ""
            }filter_name=${encodeURIComponent(normalizeText(name))}&page=0`,
        )) as Page
        if (page._links.items.length) {
            return extractUUIDv4(page._links.items[0].href)
        }
    } catch {

    }
    return null
}
const getNodeUUIDFromIdentifiers = async (
    identifiers: readonly Identifier[],
    build: number | undefined,
): Promise<UUID | null> => {
    const namespaces = identifiers.reduce<Record<Authority, ObjectID[]>>((prev, identifier) => {
        const [authority, namespace, objectID] = identifier.split("/").map(part => decodeURIComponent(part))
        const qNamespace = `${encodeURIComponent(authority)}/${encodeURIComponent(namespace)}`
        return {
            ...prev,
            [qNamespace]: [...prev[qNamespace], objectID],
        }
    }, {})
    const nodeUUIDs = await Promise.all(
        Object.entries(namespaces).map(async ([qNamespace, objectIDs]) => {
            try {
                const link: Link = await (
                    await fetch(
                        `https://api.phylopic.org/resolve/${qNamespace}?${
                            build ? `build=${encodeURIComponent(build)}&` : ""
                        }objectIDs=${encodeURIComponent(objectIDs.join(","))}`,
                    )
                ).json()
                if (isLink(isString)(link)) {
                    return extractUUIDv4(link.href)
                }
            } catch {}
            return null
        }),
    )
    return nodeUUIDs.find(uuid => isUUID(uuid)) ?? null
}
const autoIdentify = async (
    base: Pick<AugmentedPhylogeny, "identifiers" | "labelMap">,
    build: number | undefined,
    fetcher: BareFetcher,
): Promise<AugmentedPhylogeny["identifiers"]> => {
    return await Promise.all(
        base.identifiers.map(async (value, index) => {
            if (value.length > 0) {
                const existingNodeUUID = getNodeUUID(value)
                if (existingNodeUUID) {
                    return value
                }
                const newNodeUUID = await getNodeUUIDFromIdentifiers(value, build)
                if (newNodeUUID) {
                    return [...value, `phylopic.org/nodes/${encodeURIComponent(newNodeUUID)}`].sort()
                }
            }
            const nomen = base.labelMap[index]
            if (nomen) {
                const newNodeUUID = await getNodeUUIDForNomen(nomen, build, fetcher)
                if (newNodeUUID) {
                    return [`phylopic.org/nodes/${encodeURIComponent(newNodeUUID)}`]
                }
            }
            return []
        }),
    )
}
const autoAssignImages = async (
    base: Pick<AugmentedPhylogeny, "identifiers" | "imageUUIDs">,
    build: number | undefined,
    fetcher: BareFetcher,
): Promise<AugmentedPhylogeny["imageUUIDs"]> => {
    return await Promise.all(
        base.imageUUIDs.map(async (value, index) => {
            if (isUUID(value)) {
                return value
            }
            const nodeUUID = getNodeUUID(base.identifiers[index])
            if (!nodeUUID) {
                return null
            }
            return await getPrimaryImageUUIDForNodeUUID(nodeUUID, build, fetcher)
        }),
    )
}
const autoAugment = async (base: AugmentedPhylogeny): Promise<AugmentedPhylogeny> => {
    let build: number | undefined
    base = normalizeAugmentedPhylogeny(base)
    const fetcher = createAPIFetcher(build, value => {
        build = typeof value === "function" ? value(build ?? NaN) : value
    })
    await fetcher("https://api.phylopic.org/")
    const identifiers = await autoIdentify(base, build, fetcher)
    return normalizeAugmentedPhylogeny({
        ...base,
        identifiers,
        imageUUIDs: await autoAssignImages({ ...base, identifiers }, build, fetcher),
    })
}
export default autoAugment
