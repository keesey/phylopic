import type { SanitizeBucket } from "./parseSanitizeArgs.js"

export type SVGBucketTarget = {
    acl?: "public-read"
    bucket: SanitizeBucket
    bucketName: string
    keyFilter: (key: string) => boolean
    prefix: string
}

const SOURCE_IMAGES_TARGET: SVGBucketTarget = {
    bucket: "source-images",
    bucketName: "source-images.phylopic.org",
    keyFilter: key => /^images\/[^/]+\/source$/.test(key),
    prefix: "images/",
}

const UPLOADS_TARGET: SVGBucketTarget = {
    acl: "public-read",
    bucket: "uploads",
    bucketName: "uploads.phylopic.org",
    keyFilter: key => key.startsWith("files/") && !key.includes("/trash/"),
    prefix: "files/",
}

const IMAGES_TARGET: SVGBucketTarget = {
    acl: "public-read",
    bucket: "images",
    bucketName: "images.phylopic.org",
    keyFilter: key => /^images\/[^/]+\/(source\.svg|vector\.svg)$/.test(key),
    prefix: "images/",
}

const TARGETS: Record<SanitizeBucket, SVGBucketTarget> = {
    "source-images": SOURCE_IMAGES_TARGET,
    images: IMAGES_TARGET,
    uploads: UPLOADS_TARGET,
}

export const getSVGBucketTargets = (buckets: readonly SanitizeBucket[]): SVGBucketTarget[] =>
    buckets.map(bucket => TARGETS[bucket])

export const extractImageUUID = (key: string): string | null => {
    const match = key.match(/^images\/([^/]+)\//)
    return match?.[1] ?? null
}

export const matchesUUIDPrefix = (key: string, uuidPrefix: string): boolean => {
    const uuid = extractImageUUID(key)
    return uuid?.toLowerCase().startsWith(uuidPrefix) ?? false
}

export const extractUploadHash = (key: string): string | null => {
    const match = key.match(/^files\/([^/]+)$/)
    return match ? decodeURIComponent(match[1]) : null
}

export const uploadKeyForHash = (hash: string): string => `files/${encodeURIComponent(hash)}`
