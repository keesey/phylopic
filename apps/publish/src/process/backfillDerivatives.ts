import listDir from "../fsutils/listDir.js"
import { IMAGES_PUBLISH_MIRROR, imagePublishMirrorPath } from "../make/imagesPublishMirror.js"
import {
    DERIVATIVE_FOLDERS,
    DERIVATIVES_MANIFEST_FILENAME,
    listPngs,
    readDerivativesManifest,
    writeDerivativesManifestFromMirror,
} from "./derivativesManifest.js"

/** Long-side sizes that `process_raster.sh` and `process_vector.sh` scale variants down to. */
const RASTER_VARIANT_MAX_SIZES = [1536, 1024, 512]
const THUMBNAIL_FILES = ["128x128.png", "192x192.png", "64x64.png"]
const SIZE_FILENAME_PATTERN = /^(\d+)x(\d+)\.png$/

type Size = Readonly<{ height: number; width: number }>

const parseSize = (file: string): Size | null => {
    const match = SIZE_FILENAME_PATTERN.exec(file)
    return match ? { width: parseInt(match[1], 10), height: parseInt(match[2], 10) } : null
}

const sameNumbers = (a: readonly number[], b: readonly number[]) =>
    a.length === b.length && a.every((value, index) => value === b[index])

const findRasterProblems = (files: readonly string[]): string[] => {
    if (files.length === 0) {
        return ["no raster files"]
    }
    const sizes = files.map(parseSize)
    if (sizes.some(size => size === null)) {
        return [`unexpected raster filenames: ${files.join(", ")}`]
    }
    const parsed = sizes as Size[]
    const largest = parsed.reduce((prev, size) => (size.width * size.height > prev.width * prev.height ? size : prev))
    const longSide = Math.max(largest.width, largest.height)
    const problems: string[] = []
    // Variants of one silhouette share an aspect ratio, give or take a pixel of rounding.
    if (parsed.some(({ height, width }) => Math.abs(width * largest.height - largest.width * height) > longSide)) {
        problems.push(`raster aspect ratios disagree: ${files.join(", ")}`)
    }
    const expected = [longSide, ...RASTER_VARIANT_MAX_SIZES.filter(size => size < longSide)].sort((a, b) => a - b)
    const actual = parsed.map(({ height, width }) => Math.max(height, width)).sort((a, b) => a - b)
    if (!sameNumbers(actual, expected)) {
        problems.push(`raster long sides [${actual.join(", ")}] should be [${expected.join(", ")}]`)
    }
    return problems
}

const findDerivativeProblems = (
    raster: readonly string[],
    social: readonly string[],
    thumbnail: readonly string[],
): string[] => {
    const problems = findRasterProblems(raster)
    if (social.length !== 1) {
        problems.push(`expected one social file: ${social.join(", ") || "none"}`)
    }
    if (thumbnail.join() !== THUMBNAIL_FILES.join()) {
        problems.push(`unexpected thumbnail files: ${thumbnail.join(", ") || "none"}`)
    }
    return problems
}

;(async () => {
    try {
        const write = process.argv.includes("--write")
        let existing = 0
        let clean = 0
        const flagged: string[] = []
        for (const uuid of await listDir(IMAGES_PUBLISH_MIRROR)) {
            if (await readDerivativesManifest(uuid)) {
                existing++
                continue
            }
            const [raster, social, thumbnail] = await Promise.all(
                DERIVATIVE_FOLDERS.map(folder => listPngs(imagePublishMirrorPath(uuid, folder))),
            )
            const problems = findDerivativeProblems(raster, social, thumbnail)
            if (problems.length > 0) {
                flagged.push(`${uuid}: ${problems.join("; ")}`)
                continue
            }
            if (write) {
                await writeDerivativesManifestFromMirror(uuid)
            }
            clean++
        }
        console.info(`${existing} image(s) already had ${DERIVATIVES_MANIFEST_FILENAME}.`)
        console.info(`${clean} consistent image(s)${write ? ` given ${DERIVATIVES_MANIFEST_FILENAME}` : ""}.`)
        console.info(`${flagged.length} image(s) flagged; \`yarn process\` will reprocess them:`)
        for (const line of flagged) {
            console.info(`  ${line}`)
        }
        if (!write) {
            console.info("Dry run. Pass --write to write manifests for consistent images.")
        }
        process.exit(0)
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
})()
