import {
    DeleteObjectCommand,
    GetObjectCommand,
    GetObjectTaggingCommand,
    HeadObjectCommand,
    PutObjectCommand,
    S3Client,
    Tag,
} from "@aws-sdk/client-s3"
import { convertS3BodyToBuffer } from "@phylopic/utils-aws"
import { isLikelySVG, sanitizeSVG } from "@phylopic/utils/svg"
import { createHash } from "node:crypto"
import type { SVGBucketTarget } from "./targets.js"
import { extractUploadHash, uploadKeyForHash } from "./targets.js"

export type UploadRekey = {
    newHash: string
    oldHash: string
}

const hashBuffer = (body: Buffer): string => {
    const hashSum = createHash("sha256")
    hashSum.update(body)
    return hashSum.digest("hex")
}

const tagSetToQueryString = (tagSet: Tag[] | undefined): string | undefined => {
    if (!tagSet?.length) {
        return undefined
    }
    return [...tagSet]
        .filter(tag => Boolean(tag.Key && tag.Value))
        .sort((a, b) => (a.Key ?? "").localeCompare(b.Key ?? ""))
        .map(tag => `${encodeURIComponent(tag.Key!)}=${encodeURIComponent(tag.Value!)}`)
        .join("&")
}

const getContributorFromTagSet = (tagSet: Tag[] | undefined): string | undefined =>
    tagSet?.find(tag => tag.Key === "contributor")?.Value

const objectExists = async (client: S3Client, bucketName: string, key: string): Promise<boolean> => {
    try {
        await client.send(new HeadObjectCommand({ Bucket: bucketName, Key: key }))
        return true
    } catch (e) {
        if ((e as { $metadata?: { httpStatusCode?: number } }).$metadata?.httpStatusCode === 404) {
            return false
        }
        throw e
    }
}

export type SanitizeUploadResult =
    | { kind: "skipped" }
    | { kind: "unchanged" }
    | { kind: "updated"; rekey?: UploadRekey }
    | { kind: "conflict"; message: string }

export const sanitizeUploadS3Object = async (
    client: S3Client,
    target: SVGBucketTarget,
    key: string,
    dryRun: boolean,
): Promise<SanitizeUploadResult> => {
    const oldHash = extractUploadHash(key)
    if (!oldHash) {
        return { kind: "skipped" }
    }

    const head = await client.send(new HeadObjectCommand({ Bucket: target.bucketName, Key: key }))
    const [output, taggingOutput] = await Promise.all([
        client.send(new GetObjectCommand({ Bucket: target.bucketName, Key: key })),
        client.send(new GetObjectTaggingCommand({ Bucket: target.bucketName, Key: key })),
    ])
    const body = await convertS3BodyToBuffer(output.Body)
    if (!isLikelySVG(body, head.ContentType)) {
        return { kind: "skipped" }
    }

    const sanitized = sanitizeSVG(body)
    if (sanitized.equals(body)) {
        return { kind: "unchanged" }
    }

    const newHash = hashBuffer(sanitized)
    const tagSet = taggingOutput.TagSet
    const tagging = tagSetToQueryString(tagSet)

    if (newHash === oldHash) {
        if (dryRun) {
            return { kind: "updated" }
        }
        await client.send(
            new PutObjectCommand({
                ACL: target.acl,
                Body: sanitized,
                Bucket: target.bucketName,
                ContentType: head.ContentType ?? "image/svg+xml",
                Key: key,
                ...(tagging ? { Tagging: tagging } : {}),
            }),
        )
        return { kind: "updated" }
    }

    const newKey = uploadKeyForHash(newHash)
    const rekey: UploadRekey = { newHash, oldHash }

    if (await objectExists(client, target.bucketName, newKey)) {
        const existingTags = await client.send(new GetObjectTaggingCommand({ Bucket: target.bucketName, Key: newKey }))
        const existingContributor = getContributorFromTagSet(existingTags.TagSet)
        const oldContributor = getContributorFromTagSet(tagSet)
        if (existingContributor && oldContributor && existingContributor !== oldContributor) {
            return {
                kind: "conflict",
                message: `Sanitized object would collide at ${newKey}, owned by another contributor.`,
            }
        }
        if (dryRun) {
            return { kind: "updated", rekey }
        }
        await client.send(new DeleteObjectCommand({ Bucket: target.bucketName, Key: key }))
        return { kind: "updated", rekey }
    }

    if (dryRun) {
        return { kind: "updated", rekey }
    }

    await client.send(
        new PutObjectCommand({
            ACL: target.acl,
            Body: sanitized,
            Bucket: target.bucketName,
            ContentType: head.ContentType ?? "image/svg+xml",
            Key: newKey,
            ...(tagging ? { Tagging: tagging } : {}),
        }),
    )
    await client.send(new DeleteObjectCommand({ Bucket: target.bucketName, Key: key }))
    return { kind: "updated", rekey }
}
