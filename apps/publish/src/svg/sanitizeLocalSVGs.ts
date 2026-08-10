import { readFile, readdir, stat, writeFile } from "fs/promises"
import { join } from "path"
import { isLikelySVG, sanitizeSVG, svgNeedsSanitization } from "@phylopic/utils/svg"

const LOCAL_TARGETS = [
    {
        label: "source-images",
        matcher: (path: string) => /\/images\/[^/]+\/source$/.test(path),
        root: ".s3/source-images.phylopic.org",
    },
    {
        label: "published images",
        matcher: (path: string) => /\/images\/[^/]+\/(source\.svg|vector\.svg)$/.test(path),
        root: ".s3/images.phylopic.org",
    },
] as const

const walkFiles = async (directory: string): Promise<string[]> => {
    const entries = await readdir(directory, { withFileTypes: true })
    const files = await Promise.all(
        entries.map(async entry => {
            const path = join(directory, entry.name)
            if (entry.isDirectory()) {
                return walkFiles(path)
            }
            if (entry.isFile()) {
                return [path]
            }
            return []
        }),
    )
    return files.flat()
}

const sanitizeFile = async (path: string): Promise<"unchanged" | "updated"> => {
    const body = await readFile(path)
    if (!isLikelySVG(body)) {
        return "unchanged"
    }
    if (!svgNeedsSanitization(body)) {
        return "unchanged"
    }
    await writeFile(path, sanitizeSVG(body))
    return "updated"
}

;(async () => {
    let examined = 0
    let updated = 0
    try {
        for (const target of LOCAL_TARGETS) {
            try {
                await stat(target.root)
            } catch {
                console.info(`Skipping ${target.label}: ${target.root} not found.`)
                continue
            }
            const files = (await walkFiles(target.root)).filter(target.matcher)
            console.info(`${target.label}: ${files.length} candidate file(s).`)
            for (const file of files) {
                examined++
                if ((await sanitizeFile(file)) === "updated") {
                    updated++
                    console.info(`sanitized ${file}`)
                }
            }
        }
        console.info(`Examined ${examined} local file(s); sanitized ${updated}.`)
    } catch (e) {
        console.error(e)
        process.exit(1)
    }
})()
