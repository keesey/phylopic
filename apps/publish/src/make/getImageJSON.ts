import { Image, MediaLink, TitledLink } from "@phylopic/api-models"
import {
    isImageMediaType,
    normalizeUUID,
    RasterMediaType,
    shortenNomen,
    stringifyNomen,
    UUID,
    VectorMediaType,
} from "@phylopic/utils"
import { createReadStream } from "fs"
import { join } from "path"
import probeImageSize from "probe-image-size"
import listDir from "../fsutils/listDir.js"
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
const getFileMetadata = (filename: string) => {
    const stream = createReadStream(filename)
    return probeImageSize(stream)
}
const getMediaLinkArea = ({ sizes }: Pick<MediaLink, "sizes">) =>
    sizes
        .split("x", 2)
        .map(dimension => parseInt(dimension, 10))
        .reduce((prev, dimension) => prev * dimension, 1)
const sortMediaLinks = (a: MediaLink, b: MediaLink) => getMediaLinkArea(b) - getMediaLinkArea(a)
const getRasterLinks = async (uuid: UUID): Promise<readonly MediaLink<string, RasterMediaType>[]> => {
    const folder = join(".s3", "images.phylopic.org", "images", uuid, "raster")
    const files = await listDir(folder)
    const links = await Promise.all(
        files.map<Promise<MediaLink<string, RasterMediaType>>>(async file => {
            const { height, width } = await getFileMetadata(join(folder, file))
            return {
                href: IMAGES_URL_BASE + uuid + "/raster/" + file,
                sizes: `${width}x${height}`,
                type: "image/png",
            }
        }),
    )
    return links.sort(sortMediaLinks)
}
const getSocialLink = async (uuid: UUID): Promise<MediaLink<string, RasterMediaType>> => {
    // :TODO: Check existence?
    return {
        href: IMAGES_URL_BASE + uuid + "/social/1200x628.png",
        sizes: "1200x628",
        type: "image/png",
    }
}
const getSourceLink = async (uuid: UUID): Promise<MediaLink> => {
    const folder = join(".s3", "images.phylopic.org", "images", uuid)
    const files = (await listDir(folder)).filter(file => /^source\.[^.]+$/.test(file))
    if (files.length !== 1) {
        throw new Error(`Could not find source for image <${uuid}>.`)
    }
    const filename = files[0]
    const path = join(folder, filename)
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
const getThumbnailLinks = async (uuid: UUID): Promise<readonly MediaLink<string, RasterMediaType>[]> => {
    // :TODO: Check existence?
    return [
        {
            href: IMAGES_URL_BASE + uuid + "/thumbnail/192x192.png",
            sizes: "192x192",
            type: "image/png",
        },
        {
            href: IMAGES_URL_BASE + uuid + "/thumbnail/128x128.png",
            sizes: "128x128",
            type: "image/png",
        },
        {
            href: IMAGES_URL_BASE + uuid + "/thumbnail/64x64.png",
            sizes: "64x64",
            type: "image/png",
        },
    ]
}
const getVectorLink = async (uuid: UUID): Promise<MediaLink<string, VectorMediaType>> => {
    const path = uuid + "/vector.svg"
    const { height, width } = await getFileMetadata(".s3/images.phylopic.org/images/" + path)
    return {
        href: IMAGES_URL_BASE + path,
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
    const [rasterFiles, socialFile, sourceFile, thumbnailFiles, vectorFile] = await Promise.all([
        getRasterLinks(uuid),
        getSocialLink(uuid),
        getSourceLink(uuid),
        getThumbnailLinks(uuid),
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
            // :TODO: Remove this line
            "twitter:image": socialFile,
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
