#!/usr/bin/env node
import fs from "node:fs"
import path from "node:path"
import { execSync } from "node:child_process"

const ROOT = path.resolve(import.meta.dirname, "..")

const normalizeImportLine = line => {
    const match = line.match(/^(\s*)import \{ (.+) \} from (.+)$/)
    if (!match) {
        return line
    }
    const [, indent, specifiers, fromClause] = match
    const parts = specifiers.split(",").map(part => part.trim())
    if (!parts.length || !parts.every(part => part.startsWith("type "))) {
        return line
    }
    const names = parts.map(part => part.slice(5).trim()).join(", ")
    return `${indent}import type { ${names} } from ${fromClause}`
}

const normalizeFile = filePath => {
    const original = fs.readFileSync(filePath, "utf8")
    const normalized = original
        .split("\n")
        .map(line => normalizeImportLine(line))
        .join("\n")
    if (normalized !== original) {
        fs.writeFileSync(filePath, normalized)
        return true
    }
    return false
}

const files = execSync(
    String.raw`find apps packages \( -path '*/node_modules/*' -o -path '*/dist/*' -o -path '*/.next/*' -o -path '*/.turbo/*' \) -prune -o \( -name '*.ts' -o -name '*.tsx' \) -print`,
    { cwd: ROOT, encoding: "utf8" },
)
    .split("\n")
    .filter(Boolean)

let changed = 0
for (const file of files) {
    if (normalizeFile(path.join(ROOT, file))) {
        changed++
    }
}

console.log(`Normalized type-only imports in ${changed} files.`)
