import { mkdirSync, writeFileSync } from "fs"
import { dirname, join } from "path"
import { UUID } from "@phylopic/utils"
import { EntityFolder, getEntityJSONKey } from "./getEntityJSONKey.js"
import { getResolveJSONKey } from "./getResolveJSONKey.js"
import { getStaticJSONKey, StaticJSONName } from "./getStaticJSONKey.js"

export const ENTITIES_STAGING_ROOT = ".s3/entities.phylopic.org"

export const getEntitiesStagingBuildDir = (build: number) => join(ENTITIES_STAGING_ROOT, String(build))

export class EntityS3Writer {
    private readonly build: number

    constructor(build: number) {
        this.build = build
    }

    private writeKey(key: string, body: string) {
        const path = join(ENTITIES_STAGING_ROOT, key)
        mkdirSync(dirname(path), { recursive: true })
        writeFileSync(path, body, "utf8")
    }

    put(folder: EntityFolder, uuid: UUID, body: string) {
        this.writeKey(getEntityJSONKey(this.build, folder, uuid), body)
    }

    putStatic(name: StaticJSONName, body: string) {
        this.writeKey(getStaticJSONKey(this.build, name), body)
    }

    putResolve(authority: string, namespace: string, objectID: string, body: string) {
        this.writeKey(getResolveJSONKey(this.build, authority, namespace, objectID), body)
    }

    putKey(key: string, body: string) {
        this.writeKey(key, body)
    }

    async flush() {
        mkdirSync(ENTITIES_STAGING_ROOT, { recursive: true })
        writeFileSync(join(ENTITIES_STAGING_ROOT, ".staging-build"), String(this.build), "utf8")
    }
}
