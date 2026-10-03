import { readFile } from "node:fs/promises"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const docsDir = join(dirname(fileURLToPath(import.meta.url)), "../../docs")

export const readPackageDoc = (filename: string) => readFile(join(docsDir, filename), "utf8")
