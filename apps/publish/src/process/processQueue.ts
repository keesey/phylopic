import { readFile, writeFile } from "fs/promises"
import { join } from "path"
import listDir from "../fsutils/listDir.js"
import resolvePublishPath from "../fsutils/resolvePublishPath.js"

/** UUIDs copied into scratch by `preprocess.sh`, i.e. the images `process` rebuilds this run. */
export const PROCESS_QUEUE_RELATIVE_PATH = join(".scratch", "process-queue.json")

export type ProcessQueue = Readonly<{
    uuids: readonly string[]
}>

const SOURCE_BASENAME_PATTERN = /^([0-9a-f-]{36})\.source\.[^/]+$/

export const collectQueuedUuidsFromScratch = async (): Promise<readonly string[]> => {
    const uuids = new Set<string>()
    for (const scratchFolder of ["vector", "raster"] as const) {
        for (const entry of await listDir(join(".scratch", scratchFolder))) {
            const match = SOURCE_BASENAME_PATTERN.exec(entry)
            if (match) {
                uuids.add(match[1])
            }
        }
    }
    return [...uuids].sort()
}

export const writeProcessQueue = async (queue: ProcessQueue): Promise<void> => {
    await writeFile(resolvePublishPath(PROCESS_QUEUE_RELATIVE_PATH), `${JSON.stringify(queue, null, 4)}\n`, "utf8")
}

export const readProcessQueue = async (): Promise<readonly string[]> => {
    const raw = await readFile(resolvePublishPath(PROCESS_QUEUE_RELATIVE_PATH), "utf8")
    const parsed = JSON.parse(raw) as Partial<ProcessQueue>
    if (!Array.isArray(parsed.uuids) || !parsed.uuids.every(uuid => typeof uuid === "string")) {
        throw new Error("Invalid process queue.")
    }
    return parsed.uuids
}
