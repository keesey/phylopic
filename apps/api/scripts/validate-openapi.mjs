import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import SwaggerParser from "@apidevtools/swagger-parser"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const specPath = join(root, "docs/dist/v2/openapi.yaml")

await SwaggerParser.validate(specPath)
console.log(`OpenAPI spec is valid: ${specPath}`)
