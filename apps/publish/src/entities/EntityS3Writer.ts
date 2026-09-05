import { mkdir, writeFile } from "fs/promises"
import { mkdirSync, writeFileSync } from "fs"
import { dirname, join } from "path"
import { UUID } from "@phylopic/utils"
import Bottleneck from "bottleneck"
import {
    EntityFolder,
    getEntityJSONKey,
    getResolveJSONKey,
    getStaticJSONKey,
    ListName,
    StaticJSONName,
} from "@phylopic/s3-entities"
import { ENTITIES_STAGING_ROOT, WRITE_CONCURRENCY, WRITE_QUEUE_HIGH_WATER } from "./constants.js"

export const getEntitiesStagingBuildDir = (build: number) => join(ENTITIES_STAGING_ROOT, String(build))

const ENTITY_FOLDERS: readonly EntityFolder[] = ["contributors", "images", "nodes"]

const LIST_NAMES: readonly ListName[] = ["contributors", "images", "nodes"]

const getStagingDirs = (build: number): readonly string[] => {
    const buildDir = join(ENTITIES_STAGING_ROOT, String(build))
    return [
        ENTITIES_STAGING_ROOT,
        buildDir,
        ...ENTITY_FOLDERS.map(folder => join(buildDir, folder)),
        ...LIST_NAMES.flatMap(name => [join(buildDir, "lists", name), join(buildDir, "lists", name, "pages")]),
        join(buildDir, "lineages"),
        join(buildDir, "resolve"),
    ]
}

export class EntityS3Writer {
    private readonly build: number

    /** Parent directory paths that already exist on disk. */
    private readonly createdDirs = new Set<string>()

    private readonly limiter = new Bottleneck({
        maxConcurrent: WRITE_CONCURRENCY,
        highWater: WRITE_QUEUE_HIGH_WATER,
        strategy: Bottleneck.strategy.BLOCK,
    })

    constructor(build: number) {
        this.build = build
        for (const dir of getStagingDirs(build)) {
            mkdirSync(dir, { recursive: true })
            this.createdDirs.add(dir)
        }
    }

    private async ensureDir(dir: string) {
        if (this.createdDirs.has(dir)) {
            return
        }
        await mkdir(dir, { recursive: true })
        this.createdDirs.add(dir)
    }

    put(key: string, body: string): Promise<void> {
        return this.limiter.schedule(async () => {
            const path = join(ENTITIES_STAGING_ROOT, key)
            const parentDir = dirname(path)
            if (!this.createdDirs.has(parentDir)) {
                await this.ensureDir(parentDir)
            }
            await writeFile(path, body, "utf8")
        })
    }

    putEntity(folder: EntityFolder, uuid: UUID, body: string): Promise<void> {
        return this.put(getEntityJSONKey(this.build, folder, uuid), body)
    }

    putStatic(name: StaticJSONName, body: string): Promise<void> {
        return this.put(getStaticJSONKey(this.build, name), body)
    }

    putResolve(authority: string, namespace: string, objectID: string, body: string): Promise<void> {
        return this.put(getResolveJSONKey(this.build, authority, namespace, objectID), body)
    }

    async flush() {
        await this.limiter.stop({ dropWaitingJobs: false })
        writeFileSync(join(ENTITIES_STAGING_ROOT, ".staging-build"), String(this.build), "utf8")
    }
}
