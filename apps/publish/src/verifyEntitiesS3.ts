import "dotenv/config"
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { convertS3BodyToString } from "@phylopic/utils-aws"
import pg from "pg"
import { ENTITIES_BUCKET } from "./entities/constants.js"
import { EntityFolder, getEntityJSONKey } from "./entities/getEntityJSONKey.js"
const SAMPLE_SIZE = Number.parseInt(process.env.VERIFY_SAMPLE_SIZE ?? "20", 10)
const BUILD = Number.parseInt(process.argv[2] ?? "", 10)
if (Number.isNaN(BUILD)) {
    console.error("Usage: yarn verify:entities <build>")
    process.exit(1)
}
const tables: ReadonlyArray<{ folder: EntityFolder; table: string }> = [
    { folder: "contributors", table: "contributor" },
    { folder: "images", table: "image" },
    { folder: "nodes", table: "node" },
]
const s3 = new S3Client({})
const verifySample = async (client: pg.Client, folder: EntityFolder, table: string) => {
    const { rows } = await client.query<{ json: string; uuid: string }>({
        text: `SELECT uuid, json FROM ${table} WHERE build=$1::bigint ORDER BY random() LIMIT $2`,
        values: [BUILD, SAMPLE_SIZE],
    })
    let mismatches = 0
    for (const { json, uuid } of rows) {
        const key = getEntityJSONKey(BUILD, folder, uuid)
        const output = await s3.send(new GetObjectCommand({ Bucket: ENTITIES_BUCKET, Key: key }))
        const body = await convertS3BodyToString(output.Body)
        if (body !== json) {
            mismatches++
            console.error(`Mismatch: s3://${bucket}/${key}`)
        }
    }
    console.info(`Verified ${rows.length} ${table} rows (${mismatches} mismatches).`)
    return mismatches
}
;(async () => {
    const client = new pg.Client({ database: "phylopic-entities" })
    try {
        await client.connect()
        let totalMismatches = 0
        for (const { folder, table } of tables) {
            totalMismatches += await verifySample(client, folder, table)
        }
        if (totalMismatches > 0) {
            console.error(`Verification failed with ${totalMismatches} mismatches.`)
            process.exit(1)
        }
        console.info(`Build ${BUILD} verified: Postgres json matches S3 in all sampled entities.`)
    } catch (e) {
        console.error(e)
        process.exit(1)
    } finally {
        await client.end()
    }
})()
