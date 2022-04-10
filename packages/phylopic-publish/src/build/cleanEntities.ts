import type { ClientBase } from "pg"
export const cleanTables = async (client: ClientBase, build: number, operator: "=" | "<>") => {
    await client.query("BEGIN")
    await client.query(`DELETE FROM image_node WHERE build${operator}$1::bigint`, [build])
    await client.query(`DELETE FROM node_external WHERE build${operator}$1::bigint`, [build])
    await client.query(`DELETE FROM node_name WHERE build${operator}$1::bigint`, [build])
    await client.query(`DELETE FROM node WHERE build${operator}$1::bigint`, [build])
    await client.query(`DELETE FROM image WHERE build${operator}$1::bigint`, [build])
    await client.query("COMMIT")
}
const cleanEntities = async (client: ClientBase, build: number) => {
    console.info("Removing old database rows...")
    await cleanTables(client, build, "<>")
    await client.query("VACUUM")
    console.info("Removed old database rows.")
}
export default cleanEntities
