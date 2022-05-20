import { isTitledLink, TitledLink } from "@phylopic/api-models"
import { Contributor, Image, isContributor, isImage, isNode, Node } from "@phylopic/source-models"
import {
    isString,
    isUUID,
    normalizeText,
    shortenNomen,
    stringifyNomen,
    stringifyNormalized,
    UUID,
    ValidationFaultCollector,
} from "@phylopic/utils"
import { parseNomen } from "parse-nomen"
import nameMatches from "../cli/commands/utils/nameMatches"
import precedes from "../cli/commands/utils/precedes"
import { HealData } from "./getHealData"
const findCanonicalUUID = (
    nodes: ReadonlyMap<UUID, Node>,
    externals: ReadonlyMap<string, TitledLink>,
    uuid: UUID,
    visited?: Set<UUID>,
): UUID | undefined => {
    if (!isUUID(uuid)) {
        return undefined
    }
    if (nodes.has(uuid)) {
        return uuid
    }
    const external = externals.get(`phylopic.org/nodes/${uuid}`)
    if (external) {
        if (!visited) {
            visited = new Set<UUID>()
        } else if (visited.has(uuid)) {
            throw new Error("Cyclical externals! See UUID: " + uuid)
        }
        visited.add(uuid)
        return findCanonicalUUID(nodes, externals, external.href.replace(/^\/nodes\//, ""), visited)
    }
}
const findCanonicalHRef = (
    nodes: ReadonlyMap<UUID, Node>,
    externals: ReadonlyMap<string, TitledLink>,
    href: string,
): string | undefined => {
    if (href.startsWith("/nodes/")) {
        const uuid = href.replace(/^\/nodes\//, "")
        const canonicalUUID = findCanonicalUUID(nodes, externals, uuid)
        return canonicalUUID ? `/nodes/${canonicalUUID}` : undefined
    }
}
const analyze = (data: HealData): HealData => {
    const contributors = new Map<UUID, Contributor>(data.contributors)
    const contributorsToPut = new Set<UUID>(data.contributorsToPut)
    const keysToDelete = new Set(data.keysToDelete)
    const nodes = new Map<UUID, Node>(data.nodes)
    const nodesToPut = new Set<UUID>(data.nodesToPut)
    const images = new Map<UUID, Image>(data.images)
    const imagesToPut = new Set<UUID>(data.imagesToPut)
    const externals = new Map<string, TitledLink>(data.externals)
    const externalsToPut = new Set<string>(data.externalsToPut)
    let error = false
    for (const [uuid, contributor] of data.contributors.entries()) {
        try {
            let modified = contributor
            if (normalizeText(modified.name) !== modified.name) {
                console.warn(`Normalizing contributor name: ${modified.name}`)
                modified = {
                    ...modified,
                    name: normalizeText(modified.name),
                }
            }
            if (typeof modified.showEmailAddress !== "boolean") {
                console.warn(`No \`showEmailAddress\` for contributor <${uuid}>. Setting to \`false\`.`)
                modified = {
                    ...modified,
                    showEmailAddress: false,
                }
            }
            const collector = new ValidationFaultCollector()
            if (!isContributor(modified, collector)) {
                console.error("Invalid contributor: " + stringifyNormalized(modified))
                console.error(collector.list())
                throw new Error(`Invalid contributor <${uuid}>.`)
            }
            if (modified !== contributor) {
                contributors.set(uuid, JSON.parse(stringifyNormalized(modified)))
                contributorsToPut.add(uuid)
            }
        } catch (e) {
            console.error(e)
            error = true
        }
    }
    for (const [identifier, external] of data.externals.entries()) {
        try {
            let modified = external
            if (modified.title !== normalizeText(modified.title)) {
                console.warn(`Normalizing external title: ${JSON.stringify(modified.title)}.`)
                modified = {
                    ...modified,
                    title: normalizeText(modified.title),
                }
            }
            const externalUUID = modified.href.replace(/^\/nodes\//, "")
            if (!isUUID(externalUUID)) {
                console.warn(
                    `Invalid UUID for external identifier (${JSON.stringify(
                        identifier,
                    )}): <${externalUUID}>. Deleting.`,
                )
                keysToDelete.add(`externals/${identifier}/meta.json`)
                externals.delete(identifier)
                continue
            }
            if (identifier.startsWith("phylopic.org/nodes/")) {
                const nodeUUID = identifier.replace(/^phylopic\.org\/nodes\//, "")
                if (!isUUID(nodeUUID)) {
                    console.warn(`Invalid UUID in synonym: <${identifier}>. Deleting.`)
                    keysToDelete.add(`externals/${identifier}/meta.json`)
                    externals.delete(identifier)
                    continue
                }
                if (data.nodes.has(nodeUUID)) {
                    console.warn(`Identifier refers to a canonical node: <${identifier}>. Deleting.`)
                    keysToDelete.add(`externals/${identifier}/meta.json`)
                    externals.delete(identifier)
                    continue
                }
            }
            const canonicalHRef = findCanonicalHRef(nodes, externals, external.href)
            if (canonicalHRef !== modified.href) {
                console.warn(
                    `External identifier (${JSON.stringify(
                        identifier,
                    )}) is linked to a non-canonical node: <${externalUUID}>.`,
                )
                if (canonicalHRef) {
                    console.warn(`Redirecting to a canonical node: <${canonicalHRef}>.`)
                    modified = {
                        ...modified,
                        href: canonicalHRef,
                    }
                } else {
                    const parsedTitle = stringifyNomen(shortenNomen(parseNomen(modified.title)))
                    console.warn(
                        `No canonical node could be found. Matching against title (${JSON.stringify(
                            modified.title,
                        )})...`,
                    )
                    let matches = [...nodes.entries()].filter(([, { names }]) =>
                        names.some(name => nameMatches(parsedTitle, name)),
                    )
                    if (matches.length !== 1) {
                        if (matches.length > 1) {
                            // Try again with the full name.
                            matches =
                                modified.title !== parsedTitle
                                    ? [...nodes.entries()].filter(([, { names }]) =>
                                          names.some(name => nameMatches(modified.title, name)),
                                      )
                                    : matches
                            if (matches.length !== 1) {
                                matches =
                                    modified.title.toLowerCase() !== parsedTitle.toLowerCase()
                                        ? [...nodes.entries()].filter(([, { names }]) =>
                                              names.some(name => nameMatches(modified.title, name, true)),
                                          )
                                        : matches
                                if (matches.length !== 1) {
                                    console.warn("Could not find an unambiguous match. Deleting.")
                                    keysToDelete.add(`externals/${identifier}/meta.json`)
                                    externals.delete(identifier)
                                    continue
                                }
                            }
                        }
                    }
                    if (matches.length === 1) {
                        console.warn(`Found an unambiguous match: <${matches[0][0]}>.`)
                        modified = {
                            ...modified,
                            href: `/nodes/${matches[0][0]}`,
                        }
                    } else {
                        console.warn("Could not find a match. Deleting.")
                        keysToDelete.add(`externals/${identifier}/meta.json`)
                        externals.delete(identifier)
                        continue
                    }
                }
            }
            const collector = new ValidationFaultCollector()
            if (!isTitledLink(isString)(modified, collector)) {
                console.error(`Invalid external <${identifier}>. Deleting.`)
                console.error(collector.list())
                keysToDelete.add(`externals/${identifier}/meta.json`)
                externals.delete(identifier)
                continue
            }
            if (modified !== external) {
                externals.set(identifier, modified)
                externalsToPut.add(identifier)
            }
        } catch (e) {
            console.error(e)
            error = true
        }
    }
    for (const [uuid, node] of data.nodes.entries()) {
        try {
            let modified = node
            const canonicalParent =
                (modified.parent ? findCanonicalUUID(nodes, externals, modified.parent) : undefined) ?? null
            if (canonicalParent !== modified.parent) {
                if (!canonicalParent) {
                    throw new Error(`Cannot find canonical node for <${modified.parent}> (parent of <${uuid}>).`)
                }
                console.warn("Setting node parent to canonical parent. ", modified.parent, "=>", canonicalParent)
                modified = {
                    ...modified,
                    parent: canonicalParent,
                }
            }
            if (modified.parent && !nodes.has(modified.parent)) {
                throw `Node has invalid parent: <${uuid}>.`
            }
            if (!modified.parent && modified.parent !== null) {
                console.warn("Parent was undefined. Setting to `null`.")
                modified = {
                    ...modified,
                    parent: null,
                }
            }
            const collector = new ValidationFaultCollector()
            if (!isNode(modified, collector)) {
                console.error("Invalid node: " + stringifyNormalized(modified))
                console.error(collector.list())
                throw new Error(`Invalid node <${uuid}>.`)
            }
            if (modified !== node) {
                nodes.set(uuid, JSON.parse(stringifyNormalized(modified)))
                nodesToPut.add(uuid)
            }
        } catch (e) {
            console.error(e)
            error = true
        }
    }
    for (const [uuid, image] of data.images.entries()) {
        try {
            if (nodes.has(uuid)) {
                throw `UUID shared by an image and a node: <${uuid}>.`
            }
            if (!data.imageFileKeys.has(uuid)) {
                throw `Image without source file: <${uuid}>.`
            }
            let modified = image
            if (!isUUID(modified.contributor)) {
                throw `Invalid contributor UUID (<${modified.contributor}>) in image: <${uuid}>.`
            }
            if (!contributors.has(modified.contributor)) {
                throw `Cannot find contributor (UUID: <${modified.contributor}>) for image: <${uuid}>.`
            }
            const canonicalSpecific = findCanonicalUUID(nodes, externals, modified.specific)
            if (!canonicalSpecific) {
                throw new Error(`Cannot find canonical specific node for image <${uuid}>.`)
            }
            if (canonicalSpecific !== modified.specific) {
                console.warn("Using canonical node for image's specific node.")
                modified = {
                    ...modified,
                    specific: canonicalSpecific,
                }
            }
            const canonicalGeneral =
                (modified.general ? findCanonicalUUID(nodes, externals, modified.general) : undefined) ?? null
            if (canonicalGeneral !== modified.general) {
                if (!canonicalGeneral) {
                    console.warn(`Cannot find canonical general node for image <${uuid}>. Setting to \`null\`.`)
                    modified = {
                        ...modified,
                        general: null,
                    }
                } else {
                    console.warn("Using canonical node for image's general node.")
                    modified = {
                        ...modified,
                        general: canonicalGeneral,
                    }
                }
            }
            if (modified.general) {
                if (!precedes(nodes, modified.general, modified.specific)) {
                    console.warn(
                        `Removing general node for image since it does not precede the specific node: <${uuid}>.`,
                    )
                    modified = {
                        ...modified,
                        general: null,
                    }
                }
            } else if (modified.general !== null) {
                modified = {
                    ...modified,
                    general: null,
                }
            }
            if (!modified.attribution && modified.attribution !== null) {
                modified = {
                    ...modified,
                    attribution: null,
                }
            }
            if (!modified.sponsor && modified.sponsor !== null) {
                modified = {
                    ...modified,
                    sponsor: null,
                }
            }
            const collector = new ValidationFaultCollector()
            if (!isImage(modified, collector)) {
                console.error("Invalid image: " + stringifyNormalized(modified))
                console.error(collector.list())
                throw new Error(`Invalid image <${uuid}>.`)
            }
            if (modified !== image) {
                images.set(uuid, JSON.parse(stringifyNormalized(modified)))
                imagesToPut.add(uuid)
            }
        } catch (e) {
            console.error(e)
            error = true
        }
    }
    for (const uuid of data.imageFileKeys.keys()) {
        if (!images.has(uuid)) {
            console.error(`Image source file without metadata: <${uuid}>.`)
            error = true
        }
    }
    if (error) {
        console.warn("Intractable errors were found. Healing will be incomplete.")
    }
    return {
        ...data,
        contributors,
        contributorsToPut,
        externals,
        externalsToPut,
        images,
        imagesToPut,
        keysToDelete,
        nodes,
        nodesToPut,
    }
}
export default analyze
