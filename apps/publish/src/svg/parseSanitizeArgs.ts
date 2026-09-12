export type SanitizeBucket = "source-images" | "uploads" | "images"

export type SanitizeArgs = {
    buckets: readonly SanitizeBucket[]
    dryRun: boolean
    limit?: number
    manifest?: string
    uuidPrefix?: string
}

const BUCKET_FLAGS: Record<SanitizeBucket, string> = {
    "source-images": "--source-images",
    images: "--images",
    uploads: "--uploads",
}

export const parseSanitizeArgs = (argv: readonly string[]): SanitizeArgs => {
    const buckets = (Object.entries(BUCKET_FLAGS) as [SanitizeBucket, string][])
        .filter(([, flag]) => argv.includes(flag))
        .map(([bucket]) => bucket)
    const limitIndex = argv.indexOf("--limit")
    const limit = limitIndex >= 0 ? Number.parseInt(argv[limitIndex + 1] ?? "", 10) : undefined
    const prefixIndex = argv.indexOf("--uuid-prefix")
    const uuidPrefix = prefixIndex >= 0 ? argv[prefixIndex + 1]?.toLowerCase() : undefined
    const manifestIndex = argv.indexOf("--manifest")
    const manifest = manifestIndex >= 0 ? argv[manifestIndex + 1] : undefined
    if (limitIndex >= 0 && (limit === undefined || Number.isNaN(limit) || limit < 1)) {
        throw new Error("--limit requires a positive integer.")
    }
    if (prefixIndex >= 0 && !uuidPrefix) {
        throw new Error("--uuid-prefix requires a two-character hex prefix (e.g. 00).")
    }
    if (uuidPrefix && !/^[0-9a-f]{2}$/.test(uuidPrefix)) {
        throw new Error("--uuid-prefix must be two hexadecimal characters (e.g. 00, 1a, ff).")
    }
    if (manifestIndex >= 0 && !manifest) {
        throw new Error("--manifest requires a file path.")
    }
    return {
        buckets: buckets.length > 0 ? buckets : (["source-images"] as const),
        dryRun: argv.includes("--dry-run"),
        limit,
        manifest,
        uuidPrefix,
    }
}

export const printSanitizeUsage = () => {
    console.info(`Usage: yarn sanitize:svgs [options]

Options:
  --dry-run              Report without writing to S3
  --source-images        Sanitize source-images.phylopic.org (default)
  --uploads              Sanitize uploads.phylopic.org
  --images               Sanitize images.phylopic.org SVG derivatives
  --uuid-prefix <hh>     Limit to image UUIDs starting with this hex prefix
  --limit <n>            Stop after n updates (or would-update in dry run)
  --manifest <path>      Write affected image UUIDs or upload hash rekeys (old,new)

Batch workflow (recommended):
  yarn sanitize:svgs:dry-run --uuid-prefix 00
  yarn sanitize:svgs --uuid-prefix 00 --manifest batches/00.txt
  yarn download:source && yarn process && yarn upload:images
  # repeat for 01, 02, … ff`)
}
