import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs"
import { dirname, join } from "path"
import { fileURLToPath } from "url"

const KEY = "NEXT_PUBLIC_BUILD"

const getWwwEnvLocalPath = () => join(dirname(fileURLToPath(import.meta.url)), "../../../www/.env.local")

const formatEnvLine = (value: string) => `${KEY}="${value}"`

const upsertEnvLine = (content: string, line: string) => {
    const pattern = new RegExp(`^${KEY}=.*$`, "m")
    if (pattern.test(content)) {
        return content.replace(pattern, line)
    }
    const trimmed = content.trimEnd()
    return trimmed.length ? `${trimmed}\n${line}\n` : `${line}\n`
}

const updateWwwBuildEnv = (build: number) => {
    const path = getWwwEnvLocalPath()
    mkdirSync(dirname(path), { recursive: true })
    const line = formatEnvLine(build.toString(10))
    const content = existsSync(path) ? readFileSync(path, "utf8") : ""
    writeFileSync(path, upsertEnvLine(content, line), "utf8")
    console.info(`Updated ${path} with ${KEY}=${build}.`)
}

export default updateWwwBuildEnv
