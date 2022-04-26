import { parseNomen } from "parse-nomen"
import { Contributor, Image, isContributor, isImage, isNode, Node } from "phylopic-source-models"
import {
    isUUID,
    normalizeText,
    shortenNomen,
    stringifyNomen,
    stringifyNormalized,
    UUID,
    ValidationFaultCollector,
} from "phylopic-utils"
import nameMatches from "../cli/commands/utils/nameMatches"
import precedes from "../cli/commands/utils/precedes"
import { HealData } from "./getHealData"
const analyze = (data: HealData): HealData => {
    const contributors = new Map<UUID, Contributor>(data.contributors)
    const contributorsToPut = new Set<UUID>(data.contributorsToPut)
    const keysToDelete = new Set(data.keysToDelete)
    const nodes = new Map<UUID, Node>(data.nodes)
    const nodesToPut = new Set<UUID>(data.nodesToPut)
    const images = new Map<UUID, Image>(data.images)
    const imagesToPut = new Set<UUID>(data.imagesToPut)
    const externals = new Map<string, Readonly<{ uuid: UUID; title: string }>>(data.externals)
    const externalsToPut = new Set<string>(data.externalsToPut)
    let error = false
    for (const [uuid, contributor] of data.contributors.entries()) {
        try {
            const modified = contributor
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
    for (const [uuid, node] of data.nodes.entries()) {
        try {
            let modified = node
            if (modified.parent && !nodes.has(modified.parent)) {
                throw `Node has invalid parent: <${uuid}>.`
            }
            if (!node.parent && node.parent !== null) {
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
    for (const [identifier, external] of data.externals.entries()) {
        try {
            if (!isUUID(external.uuid)) {
                console.warn(
                    `Invalid UUID for external identifier (${JSON.stringify(identifier)}): <${external.uuid
                    }>. Deleting.`,
                )
                keysToDelete.add(`/externals/${identifier}/meta.json`)
                continue
            }
            if (identifier.startsWith("phylopic.org/nodes/")) {
                const nodeUUID = identifier.replace(/^phylopic\.org\/nodes\//, "")
                if (!isUUID(nodeUUID)) {
                    console.warn(`Invalid UUID in synonym: <${identifier}>. Deleting.`)
                    keysToDelete.add(`/externals/${identifier}/meta.json`)
                    continue
                }
                if (data.nodes.has(nodeUUID)) {
                    console.warn(`Identifier refers to a canonical node: <${identifier}>.`)
                    keysToDelete.add(`/externals/${identifier}/meta.json`)
                    continue
                }
            }
            if (!nodes.has(external.uuid)) {
                console.warn(
                    `External identifier (${JSON.stringify(identifier)}) is linked to a non-canonical node: <${external.uuid
                    }>. Deleting.`,
                )
                const synonymIdentifier = `phylopic.org/nodes/${external.uuid}`
                if (identifier === synonymIdentifier) {
                    console.warn("Self-referential external identifier! Deleting.")
                    keysToDelete.add(`/externals/${identifier}/meta.json`)
                    continue
                } else {
                    const synonym = externals.get(synonymIdentifier)
                    if (synonym && synonym.uuid !== external.uuid) {
                        console.warn(`Redirecting to a canonical node: <${synonym.uuid}>.`)
                        externals.set(identifier, { ...external, uuid: synonym.uuid })
                        externalsToPut.add(identifier)
                    } else {
                        const parsedTitle = stringifyNomen(shortenNomen(parseNomen(external.title)))
                        console.warn(
                            `No canonical node could be found. Matching against title (${JSON.stringify(
                                external.title,
                            )})...`,
                        )
                        let matches = [...nodes.entries()].filter(([, { names }]) =>
                            names.some(name => nameMatches(parsedTitle, name)),
                        )
                        if (matches.length !== 1) {
                            if (matches.length > 1) {
                                matches =
                                    external.title !== parsedTitle
                                        ? [...nodes.entries()].filter(([, { names }]) =>
                                            names.some(name => nameMatches(external.title, name)),
                                        )
                                        : matches
                                if (matches.length !== 1) {
                                    matches =
                                        external.title.toLowerCase() !== parsedTitle.toLowerCase()
                                            ? [...nodes.entries()].filter(([, { names }]) =>
                                                names.some(name => nameMatches(external.title, name, true)),
                                            )
                                            : matches
                                    if (matches.length !== 1) {
                                        console.warn("Could not find an unambiguous match. Deleting.")
                                        keysToDelete.add(`/externals/${identifier}/meta.json`)
                                        continue
                                    }
                                }
                            } else {
                                console.warn("Could not find a match. Deleting.")
                                keysToDelete.add(`/externals/${identifier}/meta.json`)
                                continue
                            }
                        }
                        const [matchUUID] = matches[0]
                        console.warn(`Redirecting to a canonical node: <${matchUUID}>.`)
                        externals.set(identifier, { ...external, uuid: matchUUID })
                        externalsToPut.add(identifier)
                    }
                }
                if (external.title !== normalizeText(external.title)) {
                    console.warn(
                        `Normalizing external title: ${JSON.stringify(external.title)}. (Identifier: ${JSON.stringify(
                            identifier,
                        )})`,
                    )
                    externals.set(identifier, {
                        ...(externals.get(identifier) ?? external),
                        title: normalizeText(external.title),
                    })
                    externalsToPut.add(identifier)
                }
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
            if (!nodes.has(modified.specific)) {
                throw `Cannot find specific node for image: <${uuid}>.`
            }
            if (!isUUID(modified.contributor)) {
                throw `Invalid contributor UUID (<${modified.contributor}>) in image: <${uuid}>.`
            }
            if (!contributors.has(modified.contributor)) {
                throw `Cannot find contributor (UUID: <${modified.contributor}>) for image: <${uuid}>.`
            }
            if (modified.general) {
                if (!nodes.has(modified.general)) {
                    throw `Cannot find general node for image: <${uuid}>.`
                }
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                if (!precedes(nodes, modified.general!, modified.specific)) {
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
