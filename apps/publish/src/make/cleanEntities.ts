import type { ClientBase } from "pg"
import { cleanEntitiesS3 } from "../entities/cleanEntitiesS3.js"

const CLEAN_TABLES = [
    "image_node",
    "node_external",
    "node_name",
    "node",
    "image",
    "contributor",
] as const

export const cleanTables = async (client: ClientBase, build: number, operator: "=" | "<>") => {
    const buildLabel = operator === "=" ? `${build}` : `builds other than ${build}`
    console.info(`Removing entity rows for ${buildLabel}...`)
    await client.query("BEGIN")
    for (const table of CLEAN_TABLES) {
        console.info(`Deleting from ${table} (build${operator}${build})...`)
        await client.query(`DELETE FROM ${table} WHERE build${operator}$1::bigint`, [build])
    }
    console.info(`Committing entity row deletes for ${buildLabel}...`)
    await client.query("COMMIT")
    console.info(`Removed entity rows for ${buildLabel}.`)
}

const cleanEntities = async (client: ClientBase, build: number, isDryRun: boolean = false) => {
    console.info("Removing old database rows...")
    if (!isDryRun) {
        await Promise.all([cleanTables(client, build, "<>"), cleanEntitiesS3(build, "<>")])
        await client.query("VACUUM")
    }
    console.info("Removed old database rows.")
}

export default cleanEntities
