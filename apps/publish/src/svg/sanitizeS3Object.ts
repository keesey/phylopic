import { GetObjectCommand, HeadObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { convertS3BodyToBuffer } from "@phylopic/utils-aws"
import { isLikelySVG, sanitizeSVG, svgNeedsSanitization } from "@phylopic/utils/svg"
import { sanitizeUploadS3Object } from "./sanitizeUploadS3Object.js"
import type { SVGBucketTarget } from "./targets.js"

export type SanitizeSummary = {
    conflicts: number
    examined: number
    skipped: number
    unchanged: number
    updated: number
}

export const sanitizeS3Object = async (
    client: S3Client,
    target: SVGBucketTarget,
    key: string,
    dryRun: boolean,
): Promise<"skipped" | "unchanged" | "updated" | "conflict"> => {
    if (target.bucket === "uploads") {
        const result = await sanitizeUploadS3Object(client, target, key, dryRun)
        if (result.kind === "conflict") {
            console.warn(`${key}: ${result.message}`)
            return "conflict"
        }
        return result.kind
    }
    const head = await client.send(new HeadObjectCommand({ Bucket: target.bucketName, Key: key }))
    const output = await client.send(new GetObjectCommand({ Bucket: target.bucketName, Key: key }))
    const body = await convertS3BodyToBuffer(output.Body)
    if (!isLikelySVG(body, head.ContentType)) {
        return "skipped"
    }
    if (!svgNeedsSanitization(body)) {
        return "unchanged"
    }
    if (dryRun) {
        return "updated"
    }
    const sanitized = sanitizeSVG(body)
    await client.send(
        new PutObjectCommand({
            Body: sanitized,
            Bucket: target.bucketName,
            ContentType: head.ContentType ?? "image/svg+xml",
            Key: key,
            ...(target.acl ? { ACL: target.acl } : {}),
        }),
    )
    return "updated"
}

export const createSummary = (): SanitizeSummary => ({
    conflicts: 0,
    examined: 0,
    skipped: 0,
    unchanged: 0,
    updated: 0,
})

export const recordResult = (
    summary: SanitizeSummary,
    result: "skipped" | "unchanged" | "updated" | "conflict",
) => {
    summary.examined++
    if (result === "conflict") {
        summary.conflicts++
        return
    }
    summary[result]++
}
