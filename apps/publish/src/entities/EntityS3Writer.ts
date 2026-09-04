import { mkdir, writeFile } from "fs/promises"
import { mkdirSync, writeFileSync } from "fs"
import { dirname, join } from "path"
import { UUID } from "@phylopic/utils"
import Bottleneck from "bottleneck"
import { EntityFolder, getEntityJSONKey } from "./getEntityJSONKey.js"
import { getResolveJSONKey } from "./getResolveJSONKey.js"
import { getStaticJSONKey, StaticJSONName } from "./getStaticJSONKey.js"

export const ENTITIES_STAGING_ROOT = ".s3/entities.phylopic.org"

export const getEntitiesStagingBuildDir = (build: number) => join(ENTITIES_STAGING_ROOT, String(build))

const WRITE_CONCURRENCY = 50

export class EntityS3Writer {
    private readonly build: number
    private readonly limiter = new Bottleneck({ maxConcurrent: WRITE_CONCURRENCY })

    constructor(build: number) {
        this.build = build
    }

    private scheduleWrite(key: string, body: string) {
        void this.limiter.schedule(async () => {
            const path = join(ENTITIES_STAGING_ROOT, key)
            await mkdir(dirname(path), { recursive: true })
            await writeFile(path, body, "utf8")
        })
    }

    put(folder: EntityFolder, uuid: UUID, body: string) {
        this.scheduleWrite(getEntityJSONKey(this.build, folder, uuid), body)
    }

    putStatic(name: StaticJSONName, body: string) {
        this.scheduleWrite(getStaticJSONKey(this.build, name), body)
    }

    putResolve(authority: string, namespace: string, objectID: string, body: string) {
        this.scheduleWrite(getResolveJSONKey(this.build, authority, namespace, objectID), body)
    }

    putKey(key: string, body: string) {
        this.scheduleWrite(key, body)
    }

    async flush() {
        await this.limiter.stop({ dropWaitingJobs: false })
        mkdirSync(ENTITIES_STAGING_ROOT, { recursive: true })
        writeFileSync(join(ENTITIES_STAGING_ROOT, ".staging-build"), String(this.build), "utf8")
    }
}
