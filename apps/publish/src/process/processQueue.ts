import { readFile, writeFile } from "fs/promises"
import { join } from "path"
import listDir from "../fsutils/listDir.js"
import resolvePublishPath from "../fsutils/resolvePublishPath.js"

export const PROCESS_QUEUE_RELATIVE_PATH = join(".scratch", "process-queue.json")

export type ProcessQueue = Readonly<{
    uuids: readonly string[]
}>

const sourceBasenamePattern = /^([0-9a-f-]{36})\.source\.[^/]+$/

export const collectQueuedUuidsFromScratch = async (): Promise<readonly string[]> => {
    const uuids = new Set<string>()
    for (const scratchFolder of ["vector", "raster"] as const) {
        const folder = join(".scratch", scratchFolder)
        let entries: string[]
        try {
            entries = await listDir(folder)
        } catch (error) {
            if ((error as NodeJS.ErrnoException).code === "ENOENT") {
                continue
            }
            throw error
        }
        for (const entry of entries) {
            const match = sourceBasenamePattern.exec(entry)
            if (match) {
                uuids.add(match[1])
            }
        }
    }
    return [...uuids].sort()
}

export const writeProcessQueue = async (queue: ProcessQueue): Promise<void> => {
    await writeFile(resolvePublishPath(PROCESS_QUEUE_RELATIVE_PATH), `${JSON.stringify(queue, null, 2)}\n`, "utf8")
}

export const readProcessQueue = async (): Promise<readonly string[]> => {
    try {
        const raw = await readFile(resolvePublishPath(PROCESS_QUEUE_RELATIVE_PATH), "utf8")
        const parsed = JSON.parse(raw) as ProcessQueue
        if (!Array.isArray(parsed.uuids)) {
            throw new Error("Invalid process queue shape.")
        }
        return parsed.uuids
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === "ENOENT") {
            return collectQueuedUuidsFromScratch()
        }
        throw error
    }
}
