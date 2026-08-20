import "dotenv/config"
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { convertS3BodyToString } from "@phylopic/utils-aws"
import { stringifyNormalized } from "@phylopic/utils"
import pg from "pg"
import { ENTITIES_BUCKET } from "./entities/constants.js"
import { EntityFolder, getEntityJSONKey } from "./entities/getEntityJSONKey.js"
import { getStaticJSONKey } from "./entities/getStaticJSONKey.js"
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
            console.error(`Mismatch: s3://${ENTITIES_BUCKET}/${key}`)
        }
    }
    console.info(`Verified ${rows.length} ${table} rows (${mismatches} mismatches).`)
    return mismatches
}
const verifyNamespaces = async (client: pg.Client) => {
    const { rows } = await client.query<{ authority: string; namespace: string }>(
        'SELECT authority,"namespace" FROM node_external GROUP BY authority,"namespace" ORDER BY authority,"namespace"',
    )
    const expected = stringifyNormalized({ build: BUILD, namespaces: rows })
    const key = getStaticJSONKey(BUILD, "namespaces")
    const output = await s3.send(new GetObjectCommand({ Bucket: ENTITIES_BUCKET, Key: key }))
    const body = await convertS3BodyToString(output.Body)
    if (body !== expected) {
        console.error(`Mismatch: s3://${ENTITIES_BUCKET}/${key}`)
        return 1
    }
    console.info(`Verified namespaces.json (${rows.length} namespaces).`)
    return 0
}
;(async () => {
    const client = new pg.Client({ database: "phylopic-entities" })
    try {
        await client.connect()
        let totalMismatches = 0
        for (const { folder, table } of tables) {
            totalMismatches += await verifySample(client, folder, table)
        }
        totalMismatches += await verifyNamespaces(client)
        if (totalMismatches > 0) {
            console.error(`Verification failed with ${totalMismatches} mismatches.`)
            process.exit(1)
        }
        console.info(`Build ${BUILD} verified: Postgres json matches S3 in all sampled entities and namespaces.json.`)
    } catch (e) {
        console.error(e)
        process.exit(1)
    } finally {
        await client.end()
    }
})()
