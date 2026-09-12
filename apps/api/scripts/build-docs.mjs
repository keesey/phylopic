import { cpSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs"
import { dirname, join, relative } from "node:path"
import { fileURLToPath } from "node:url"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const version = JSON.parse(readFileSync(join(root, "package.json"), "utf8")).version
const srcDir = join(root, "docs")
const distDir = join(root, "docs/dist")
const VERSION_PLACEHOLDER = "__VERSION__"
const VERSION_FILES = new Set(["v2/index.html", "v2/openapi.yaml"])

function copyEntry(srcPath, destPath) {
    const rel = relative(srcDir, srcPath).replace(/\\/g, "/")
    if (VERSION_FILES.has(rel)) {
        const content = readFileSync(srcPath, "utf8").replaceAll(VERSION_PLACEHOLDER, version)
        writeFileSync(destPath, content)
        return
    }
    cpSync(srcPath, destPath)
}

function copyTree(src, dest) {
    mkdirSync(dest, { recursive: true })
    for (const entry of readdirSync(src)) {
        if (entry === "dist") {
            continue
        }
        const srcPath = join(src, entry)
        const destPath = join(dest, entry)
        if (statSync(srcPath).isDirectory()) {
            copyTree(srcPath, destPath)
        } else {
            copyEntry(srcPath, destPath)
        }
    }
}

rmSync(distDir, { recursive: true, force: true })
copyTree(srcDir, distDir)
console.info(`Built API docs for version ${version} at docs/dist/`)
