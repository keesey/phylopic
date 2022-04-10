import { createReadStream } from "fs"
import { join } from "path"
import { Image, isImageMediaType, Link, MediaLink, RasterMediaType, VectorMediaType } from "phylopic-api-models/src"
import { normalizeUUID, UUID } from "phylopic-source-models/src"
import probeImageSize from "probe-image-size"
import listDir from "../fsutils/listDir"
import type { SourceData } from "./getSourceData"

const IMAGES_URL_BASE = "http://images.phylopic.org/images/"
const getNodes = (uuid: string, data: SourceData): readonly Link[] => {
    const nodeUUIDs = data.illustration.get(uuid)
    if (!nodeUUIDs) {
        return []
    }
    return nodeUUIDs.map(nodeUUID => ({ href: `/nodes/${encodeURIComponent(nodeUUID)}` }))
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
    const [rasterFiles, socialFile, sourceFile, thumbnailFiles, vectorFile] = await Promise.all([
        getRasterLinks(uuid),
        getSocialLink(uuid),
        getSourceLink(uuid),
        getThumbnailLinks(uuid),
        getVectorLink(uuid),
    ])
    return {
        _links: {
            contributor: {
                href: `/contributors/${encodeURIComponent(sourceImage.contributor)}`,
            },
            generalNode: sourceImage.general
                ? {
                    href: `/nodes/${encodeURIComponent(sourceImage.general)}`,
                }
                : null,
            "http://ogp.me/ns#image": socialFile,
            license: {
                href: sourceImage.license,
            },
            nodes: getNodes(uuid, data),
            rasterFiles,
            self: {
                href: `/images/${encodeURIComponent(uuid)}`,
            },
            sourceFile,
            specificNode: {
                href: `/nodes/${encodeURIComponent(sourceImage.specific)}`,
            },
            thumbnailFiles,
            "twitter:image": socialFile,
            vectorFile,
        },
        attribution: sourceImage.attribution || null,
        build: data.build,
        created: sourceImage.created,
        sponsor: sourceImage.sponsor || null,
        uuid,
    }
}
export default getImageJSON
