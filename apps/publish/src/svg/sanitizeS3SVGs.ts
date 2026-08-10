import "dotenv/config"
import { writeFile } from "fs/promises"
import { ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3"
import { createSummary, recordResult, sanitizeS3Object } from "./sanitizeS3Object.js"
import { sanitizeUploadS3Object } from "./sanitizeUploadS3Object.js"
import { parseSanitizeArgs, printSanitizeUsage } from "./parseSanitizeArgs.js"
import { extractImageUUID, getSVGBucketTargets, matchesUUIDPrefix } from "./targets.js"

const listKeys = async (client: S3Client, bucketName: string, prefix: string): Promise<string[]> => {
    const keys: string[] = []
    let continuationToken: string | undefined
    do {
        const output = await client.send(
            new ListObjectsV2Command({
                Bucket: bucketName,
                ContinuationToken: continuationToken,
                Prefix: prefix,
            }),
        )
        for (const object of output.Contents ?? []) {
            if (object.Key) {
                keys.push(object.Key)
            }
        }
        continuationToken = output.IsTruncated ? output.NextContinuationToken : undefined
    } while (continuationToken)
    return keys
}

;(async () => {
    let args
    try {
        args = parseSanitizeArgs(process.argv.slice(2))
    } catch (e) {
        console.error(e instanceof Error ? e.message : e)
        printSanitizeUsage()
        process.exit(1)
    }
    const { buckets, dryRun, limit, manifest, uuidPrefix } = args
    const s3 = new S3Client({})
    const summary = createSummary()
    const affectedUUIDs = new Set<string>()
    const rekeyedHashes: string[] = []
    let stoppedEarly = false

    console.info(dryRun ? "Scanning S3 buckets for SVG objects (dry run)..." : "Scanning S3 buckets for SVG objects...")
    if (uuidPrefix) {
        console.info(`UUID prefix filter: ${uuidPrefix}`)
    }
    console.info(`Buckets: ${buckets.join(", ")}`)

    try {
        for (const target of getSVGBucketTargets(buckets)) {
            const keys = (await listKeys(s3, target.bucketName, target.prefix))
                .filter(target.keyFilter)
                .filter(key => (uuidPrefix ? matchesUUIDPrefix(key, uuidPrefix) : true))
            console.info(`${target.bucketName}: ${keys.length} candidate object(s).`)
            for (const key of keys) {
                if (target.bucket === "uploads") {
                    const result = await sanitizeUploadS3Object(s3, target, key, dryRun)
                    if (result.kind === "conflict") {
                        console.warn(`${key}: ${result.message}`)
                        recordResult(summary, "conflict")
                        continue
                    }
                    recordResult(summary, result.kind)
                    if (result.kind === "updated") {
                        const rekeyNote = result.rekey
                            ? ` (rekey ${result.rekey.oldHash} -> ${result.rekey.newHash})`
                            : ""
                        console.info(
                            `${dryRun ? "[dry run] would update" : "updated"} s3://${target.bucketName}/${key}${rekeyNote}`,
                        )
                        if (result.rekey) {
                            rekeyedHashes.push(`${result.rekey.oldHash},${result.rekey.newHash}`)
                        }
                        if (limit !== undefined && summary.updated >= limit) {
                            stoppedEarly = true
                            break
                        }
                    }
                    continue
                }
                const result = await sanitizeS3Object(s3, target, key, dryRun)
                recordResult(summary, result)
                if (result === "updated") {
                    const uuid = extractImageUUID(key)
                    if (uuid) {
                        affectedUUIDs.add(uuid)
                    }
                    console.info(`${dryRun ? "[dry run] would update" : "updated"} s3://${target.bucketName}/${key}`)
                    if (limit !== undefined && summary.updated >= limit) {
                        stoppedEarly = true
                        break
                    }
                }
            }
            if (stoppedEarly) {
                break
            }
        }
        console.info(
            `Examined ${summary.examined} object(s): ${summary.updated} require sanitization${
                dryRun ? " (dry run — nothing written)" : `, ${summary.updated} updated`
            }, ${summary.unchanged} already clean, ${summary.skipped} skipped (non-SVG)${
                summary.conflicts > 0 ? `, ${summary.conflicts} conflict(s)` : ""
            }.`,
        )
        if (affectedUUIDs.size > 0) {
            console.info(`${affectedUUIDs.size} image UUID(s) affected.`)
        }
        if (rekeyedHashes.length > 0) {
            console.info(`${rekeyedHashes.length} upload hash(es) would change or changed.`)
        }
        if (manifest && affectedUUIDs.size > 0) {
            await writeFile(manifest, `${[...affectedUUIDs].sort().join("\n")}\n`)
            console.info(`Wrote manifest to ${manifest}.`)
        }
        if (manifest && rekeyedHashes.length > 0 && affectedUUIDs.size === 0) {
            await writeFile(manifest, `${rekeyedHashes.sort().join("\n")}\n`)
            console.info(`Wrote upload rekey manifest to ${manifest}.`)
        }
        if (stoppedEarly) {
            console.info(`Stopped after ${limit} update(s) (--limit).`)
        }
        if (summary.updated > 0 && dryRun) {
            console.info("Re-run without --dry-run to write sanitized objects.")
        }
        if (summary.updated > 0 && buckets.includes("source-images") && !dryRun) {
            console.info("Next: yarn download:source && yarn process && yarn upload:images")
        }
    } catch (e) {
        console.error(e)
        process.exit(1)
    }
})()
