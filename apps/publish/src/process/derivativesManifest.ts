import { readFile, unlink, writeFile } from "fs/promises"
import { join } from "path"
import listDir from "../fsutils/listDir.js"
import resolvePublishPath from "../fsutils/resolvePublishPath.js"
import { imagePublishMirrorPath } from "../make/imagesPublishMirror.js"

/** Stored beside each image's derivatives so it persists across builds via the images bucket. */
export const DERIVATIVES_MANIFEST_FILENAME = "derivatives.json"

export const DERIVATIVE_FOLDERS = ["raster", "social", "thumbnail"] as const

export type DerivativeFolder = (typeof DERIVATIVE_FOLDERS)[number]

export type DerivativesManifest = Readonly<Record<DerivativeFolder, readonly string[]>>

const isENOENT = (error: unknown) => (error as NodeJS.ErrnoException).code === "ENOENT"

const getManifestPath = (uuid: string) => resolvePublishPath(imagePublishMirrorPath(uuid, DERIVATIVES_MANIFEST_FILENAME))

const isDerivativesManifest = (x: unknown): x is DerivativesManifest =>
    typeof x === "object" &&
    x !== null &&
    DERIVATIVE_FOLDERS.every(folder => {
        const files = (x as Record<string, unknown>)[folder]
        return Array.isArray(files) && files.every(file => typeof file === "string")
    })

export const listPngs = async (folder: string): Promise<string[]> => {
    try {
        return (await listDir(folder)).filter(file => file.endsWith(".png")).sort()
    } catch (error) {
        if (isENOENT(error)) {
            return []
        }
        throw error
    }
}

export const readDerivativesManifest = async (uuid: string): Promise<DerivativesManifest | null> => {
    let raw: string
    try {
        raw = await readFile(getManifestPath(uuid), "utf8")
    } catch (error) {
        if (isENOENT(error)) {
            return null
        }
        throw error
    }
    const parsed: unknown = JSON.parse(raw)
    if (!isDerivativesManifest(parsed)) {
        throw new Error(`Invalid ${DERIVATIVES_MANIFEST_FILENAME} for image <${uuid}>.`)
    }
    return parsed
}

/** Only valid right after `process` has rebuilt the image's mirror folder from scratch. */
export const writeDerivativesManifestFromMirror = async (uuid: string): Promise<DerivativesManifest> => {
    const [raster, social, thumbnail] = await Promise.all(
        DERIVATIVE_FOLDERS.map(folder => listPngs(imagePublishMirrorPath(uuid, folder))),
    )
    const manifest: DerivativesManifest = { raster, social, thumbnail }
    await writeFile(getManifestPath(uuid), `${JSON.stringify(manifest, null, 4)}\n`, "utf8")
    return manifest
}

/** Deletes derivative PNGs in the mirror that the manifest doesn't list. Returns the number deleted. */
export const pruneUnlistedDerivatives = async (uuid: string, manifest: DerivativesManifest): Promise<number> => {
    const deletions = await Promise.all(
        DERIVATIVE_FOLDERS.map(async folder => {
            const listed = new Set(manifest[folder])
            const mirrorFolder = imagePublishMirrorPath(uuid, folder)
            const unlisted = (await listPngs(mirrorFolder)).filter(file => !listed.has(file))
            await Promise.all(unlisted.map(file => unlink(resolvePublishPath(join(mirrorFolder, file)))))
            return unlisted.length
        }),
    )
    return deletions.reduce((sum, count) => sum + count, 0)
}
