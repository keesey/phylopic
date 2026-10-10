import { readFile, unlink, writeFile } from "fs/promises"
import listDir from "../fsutils/listDir.js"
import resolvePublishPath from "../fsutils/resolvePublishPath.js"
import { imagePublishMirrorPath } from "../make/imagesPublishMirror.js"
import { readProcessQueue } from "./processQueue.js"

export const PROCESS_MANIFEST_RELATIVE_PATH = ".process-manifest.json"

export type ProcessedImageDerivativeFiles = Readonly<{
    raster: readonly string[]
    social: readonly string[]
    thumbnail: readonly string[]
}>

export type ProcessManifest = Readonly<{
    images: Readonly<Record<string, ProcessedImageDerivativeFiles>>
}>

const emptyManifest = (): ProcessManifest => ({ images: {} })

const resolveManifestPath = () => resolvePublishPath(PROCESS_MANIFEST_RELATIVE_PATH)

export const readProcessManifest = async (): Promise<ProcessManifest | null> => {
    try {
        const raw = await readFile(resolveManifestPath(), "utf8")
        const parsed = JSON.parse(raw) as ProcessManifest
        if (!parsed.images || typeof parsed.images !== "object") {
            throw new Error("Invalid process manifest shape.")
        }
        return parsed
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === "ENOENT") {
            return null
        }
        throw error
    }
}

export const writeProcessManifest = async (manifest: ProcessManifest): Promise<void> => {
    await writeFile(resolveManifestPath(), `${JSON.stringify(manifest, null, 2)}\n`, "utf8")
}

export const clearProcessManifest = async (): Promise<void> => {
    try {
        await unlink(resolveManifestPath())
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
            throw error
        }
    }
}

const listPngBasenames = async (folderRelativePath: string): Promise<string[]> => {
    try {
        const files = await listDir(folderRelativePath)
        return files.filter(file => file.endsWith(".png")).sort()
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === "ENOENT") {
            return []
        }
        throw error
    }
}

const pruneExtraPngs = async (
    uuid: string,
    folderName: "raster" | "thumbnail" | "social",
    allowed: ReadonlySet<string>,
): Promise<void> => {
    const folder = imagePublishMirrorPath(uuid, folderName)
    const onDisk = await listPngBasenames(folder)
    await Promise.all(
        onDisk
            .filter(file => !allowed.has(file))
            .map(file => unlink(resolvePublishPath(`${folder}/${file}`))),
    )
}

export const buildProcessManifestFromMirror = async (): Promise<ProcessManifest> => {
    const uuids = await readProcessQueue()
    const images: Record<string, ProcessedImageDerivativeFiles> = {}

    for (const uuid of uuids) {
        const [raster, thumbnail, social] = await Promise.all([
            listPngBasenames(imagePublishMirrorPath(uuid, "raster")),
            listPngBasenames(imagePublishMirrorPath(uuid, "thumbnail")),
            listPngBasenames(imagePublishMirrorPath(uuid, "social")),
        ])

        await Promise.all([
            pruneExtraPngs(uuid, "raster", new Set(raster)),
            pruneExtraPngs(uuid, "thumbnail", new Set(thumbnail)),
            pruneExtraPngs(uuid, "social", new Set(social)),
        ])

        images[uuid] = { raster, thumbnail, social }
    }

    return { images }
}

export const writeProcessManifestFromMirror = async (): Promise<ProcessManifest> => {
    const manifest = await buildProcessManifestFromMirror()
    await writeProcessManifest(manifest)
    return manifest
}

export const getProcessedDerivativeFiles = (
    manifest: ProcessManifest | null,
    uuid: string,
): ProcessedImageDerivativeFiles | null => manifest?.images[uuid] ?? null

export { emptyManifest }
