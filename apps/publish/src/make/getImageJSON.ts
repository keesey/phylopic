import type { Image, MediaLink, TitledLink } from "@phylopic/api-models"
import {
    isImageMediaType,
    normalizeUUID,
    type RasterMediaType,
    shortenNomen,
    stringifyNomen,
    type UUID,
    type VectorMediaType,
} from "@phylopic/utils"
import { createReadStream } from "fs"
import probeImageSize from "probe-image-size"
import listDir from "../fsutils/listDir.js"
import resolvePublishPath from "../fsutils/resolvePublishPath.js"
import { getProcessedDerivativeFiles, readProcessManifest, type ProcessManifest } from "../process/processManifest.js"
import { imagePublishMirrorPath } from "./imagesPublishMirror.js"
import type { SourceData } from "./getSourceData.js"

const IMAGES_URL_BASE = "https://images.phylopic.org/images/"

const getNodes = (uuid: string, data: SourceData): readonly TitledLink[] => {
    const nodeUUIDs = data.illustration.get(uuid)
    if (!nodeUUIDs) {
        return []
    }
    return nodeUUIDs.map(nodeUUID => ({
        href: `/nodes/${encodeURIComponent(nodeUUID)}?build=${data.build}`,
        title: stringifyNomen(shortenNomen(data.nodes.get(nodeUUID)?.names[0] ?? [])) || "[Unnamed]",
    }))
}

const getFileMetadata = (relativePath: string) => {
    const stream = createReadStream(resolvePublishPath(relativePath))
    return probeImageSize(stream)
}

const getMediaLinkArea = ({ sizes }: Pick<MediaLink, "sizes">) =>
    sizes
        .split("x", 2)
        .map(dimension => parseInt(dimension, 10))
        .reduce((prev, dimension) => prev * dimension, 1)

const sortMediaLinks = (a: MediaLink, b: MediaLink) => getMediaLinkArea(b) - getMediaLinkArea(a)

let cachedProcessManifest: ProcessManifest | null | undefined

const loadProcessManifest = async (): Promise<ProcessManifest | null> => {
    if (cachedProcessManifest === undefined) {
        cachedProcessManifest = await readProcessManifest()
    }
    return cachedProcessManifest
}

/** Lists PNG variants under the local publish mirror (not live S3 during cutover). */
const getPngMediaLinksFromMirrorFolder = async (
    uuid: UUID,
    folderName: "raster" | "thumbnail" | "social",
    manifest: ProcessManifest | null,
): Promise<readonly MediaLink<string, RasterMediaType>[]> => {
    const folder = imagePublishMirrorPath(uuid, folderName)
    const processed = getProcessedDerivativeFiles(manifest, uuid)
    const files =
        processed !== null
            ? [...processed[folderName]]
            : (await listDir(folder)).filter(file => file.endsWith(".png"))
    const links = await Promise.all(
        files.map<Promise<MediaLink<string, RasterMediaType>>>(async file => {
            const { height, width } = await getFileMetadata(`${folder}/${file}`)
            return {
                href: `${IMAGES_URL_BASE}${uuid}/${folderName}/${file}`,
                sizes: `${width}x${height}`,
                type: "image/png",
            }
        }),
    )
    return links.sort(sortMediaLinks)
}

const getRasterLinks = (uuid: UUID, manifest: ProcessManifest | null) =>
    getPngMediaLinksFromMirrorFolder(uuid, "raster", manifest)

const getSocialLink = async (
    uuid: UUID,
    manifest: ProcessManifest | null,
): Promise<MediaLink<string, RasterMediaType>> => {
    const links = await getPngMediaLinksFromMirrorFolder(uuid, "social", manifest)
    if (links.length === 0) {
        throw new Error(`Could not find social image for image <${uuid}>.`)
    }
    return links[0]
}

const getSourceLink = async (uuid: UUID): Promise<MediaLink> => {
    const folder = imagePublishMirrorPath(uuid)
    const files = (await listDir(folder)).filter(file => /^source\.[^.]+$/.test(file))
    if (files.length !== 1) {
        throw new Error(`Could not find source for image <${uuid}>.`)
    }
    const filename = files[0]
    const path = `${folder}/${filename}`
    const { height, mime, width } = await getFileMetadata(path)
    if (!isImageMediaType(mime)) {
        throw new Error(`Unrecognized MIME type (${mime}) for image. <${uuid}>`)
    }
    return {
        href: IMAGES_URL_BASE + uuid + "/" + filename,
        sizes: `${width}x${height}`,
        type: mime,
    }
}

const getThumbnailLinks = (uuid: UUID, manifest: ProcessManifest | null) =>
    getPngMediaLinksFromMirrorFolder(uuid, "thumbnail", manifest)

const getVectorLink = async (uuid: UUID): Promise<MediaLink<string, VectorMediaType>> => {
    const path = imagePublishMirrorPath(uuid, "vector.svg")
    const { height, width } = await getFileMetadata(path)
    return {
        href: IMAGES_URL_BASE + uuid + "/vector.svg",
        sizes: `${width}x${height}`,
        type: "image/svg+xml",
    }
}

const getImageJSON = async (uuid: UUID, data: SourceData): Promise<Image> => {
    uuid = normalizeUUID(uuid)
    const sourceImage = data.images.get(uuid)
    if (!sourceImage) {
        throw new Error(`Source image not found! <${uuid}>`)
    }
    const modifiedFile = data.filesModified.get(uuid) ?? sourceImage.modified
    const processManifest = await loadProcessManifest()
    const [rasterFiles, socialFile, sourceFile, thumbnailFiles, vectorFile] = await Promise.all([
        getRasterLinks(uuid, processManifest),
        getSocialLink(uuid, processManifest),
        getSourceLink(uuid),
        getThumbnailLinks(uuid, processManifest),
        getVectorLink(uuid),
    ])
    const specificTitle =
        stringifyNomen(shortenNomen(data.nodes.get(sourceImage.specific)?.names[0] ?? [])) || "[Unnamed]"
    return {
        _links: {
            contributor: {
                href: `/contributors/${encodeURIComponent(sourceImage.contributor)}?build=${data.build}`,
                title: data.contributors.get(sourceImage.contributor)?.name || "[Anonymous]",
            },
            generalNode: sourceImage.general
                ? {
                      href: `/nodes/${encodeURIComponent(sourceImage.general)}?build=${data.build}`,
                      title:
                          stringifyNomen(shortenNomen(data.nodes.get(sourceImage.general)?.names[0] ?? [])) ||
                          "[Unnamed]",
                  }
                : null,
            "http://ogp.me/ns#image": socialFile,
            license: {
                href: sourceImage.license,
            },
            nodes: getNodes(uuid, data),
            rasterFiles,
            self: {
                href: `/images/${encodeURIComponent(uuid)}?build=${data.build}`,
                title: specificTitle,
            },
            sourceFile,
            specificNode: {
                href: `/nodes/${encodeURIComponent(sourceImage.specific)}?build=${data.build}`,
                title: specificTitle,
            },
            thumbnailFiles,
            vectorFile,
        },
        attribution: sourceImage.attribution || null,
        build: data.build,
        created: sourceImage.created,
        modified: sourceImage.modified,
        modifiedFile,
        sponsor: sourceImage.sponsor || null,
        ...(sourceImage.unlisted ? { unlisted: true } : null),
        uuid,
    }
}

export default getImageJSON
