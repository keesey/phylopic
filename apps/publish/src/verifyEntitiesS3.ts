import "dotenv/config"
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { convertS3BodyToString } from "@phylopic/utils-aws"
import { createSearch, stringifyNormalized } from "@phylopic/utils"
import pg from "pg"
import { ENTITIES_BUCKET } from "./entities/constants.js"
import { EntityFolder, getEntityJSONKey } from "./entities/getEntityJSONKey.js"
import {
    getDefaultListIndexKey,
    getLineageIndexKey,
} from "./entities/getListJSONKey.js"
import { getResolveJSONKey } from "./entities/getResolveJSONKey.js"
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
const verifyResolveSample = async (client: pg.Client) => {
    const { rows } = await client.query<{
        authority: string
        namespace: string
        objectid: string
        node_uuid: string
        title: string | null
    }>({
        text: `SELECT authority,"namespace",objectid,node_uuid,title FROM node_external WHERE build=$1::bigint ORDER BY random() LIMIT $2`,
        values: [BUILD, SAMPLE_SIZE],
    })
    let mismatches = 0
    for (const { authority, namespace, objectid, node_uuid, title } of rows) {
        const expected = stringifyNormalized({
            href: `/nodes/${encodeURIComponent(node_uuid)}${createSearch({ build: BUILD })}`,
            title: title ?? "",
        })
        const key = getResolveJSONKey(BUILD, authority, namespace, objectid)
        const output = await s3.send(new GetObjectCommand({ Bucket: ENTITIES_BUCKET, Key: key }))
        const body = await convertS3BodyToString(output.Body)
        if (body !== expected) {
            mismatches++
            console.error(`Mismatch: s3://${ENTITIES_BUCKET}/${key}`)
        }
    }
    console.info(`Verified ${rows.length} resolve objects (${mismatches} mismatches).`)
    return mismatches
}
const verifyDefaultListIndex = async (
    client: pg.Client,
    listName: "contributors" | "images" | "nodes",
    countQuery: string,
) => {
    const { rows } = await client.query<{ total: string }>({
        text: countQuery,
        values: [BUILD],
    })
    const expectedTotal = parseInt(rows[0]?.total ?? "0", 10) || 0
    const key = getDefaultListIndexKey(BUILD, listName)
    const output = await s3.send(new GetObjectCommand({ Bucket: ENTITIES_BUCKET, Key: key }))
    const body = await convertS3BodyToString(output.Body)
    const { totalItems } = JSON.parse(body) as { totalItems: number }
    if (totalItems !== expectedTotal) {
        console.error(
            `Mismatch: s3://${ENTITIES_BUCKET}/${key} (expected totalItems=${expectedTotal}, got ${totalItems})`,
        )
        return 1
    }
    console.info(`Verified ${listName} list index (${totalItems} items).`)
    return 0
}
const verifyLineageSample = async (client: pg.Client) => {
    const { rows } = await client.query<{ uuid: string }>({
        text: `SELECT uuid FROM node WHERE build=$1::bigint ORDER BY random() LIMIT 1`,
        values: [BUILD],
    })
    if (rows.length === 0) {
        console.info("Skipped lineage verification (no nodes).")
        return 0
    }
    const uuid = rows[0].uuid
    const { rows: lineageRows } = await client.query<{ total: string }>({
        text: `
WITH RECURSIVE predecessors AS (
    SELECT "uuid",parent_uuid,build,0 as lineage_index
        FROM node
        WHERE "uuid"=$1::uuid AND build=$2::bigint
    UNION
    SELECT n."uuid",n.parent_uuid,n.build,suc.lineage_index + 1
        FROM node n
        INNER JOIN predecessors suc ON suc.parent_uuid=n."uuid" AND suc.build=n.build
)
SELECT COUNT("uuid") AS total FROM predecessors
`,
        values: [uuid, BUILD],
    })
    const expectedTotal = parseInt(lineageRows[0]?.total ?? "0", 10) || 0
    const key = getLineageIndexKey(BUILD, uuid)
    const output = await s3.send(new GetObjectCommand({ Bucket: ENTITIES_BUCKET, Key: key }))
    const body = await convertS3BodyToString(output.Body)
    const { totalItems } = JSON.parse(body) as { totalItems: number }
    if (totalItems !== expectedTotal) {
        console.error(
            `Mismatch: s3://${ENTITIES_BUCKET}/${key} (expected totalItems=${expectedTotal}, got ${totalItems})`,
        )
        return 1
    }
    console.info(`Verified lineage index for ${uuid} (${totalItems} items).`)
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
        totalMismatches += await verifyResolveSample(client)
        totalMismatches += await verifyDefaultListIndex(
            client,
            "contributors",
            'SELECT COUNT("uuid") AS total FROM contributor WHERE build=$1::bigint AND unlisted=0::bit',
        )
        totalMismatches += await verifyDefaultListIndex(
            client,
            "nodes",
            'SELECT COUNT("uuid") AS total FROM node WHERE build=$1::bigint',
        )
        totalMismatches += await verifyDefaultListIndex(
            client,
            "images",
            'SELECT COUNT("uuid") AS total FROM image WHERE build=$1::bigint AND unlisted=0::bit',
        )
        totalMismatches += await verifyLineageSample(client)
        if (totalMismatches > 0) {
            console.error(`Verification failed with ${totalMismatches} mismatches.`)
            process.exit(1)
        }
        console.info(
            `Build ${BUILD} verified: Postgres json matches S3 in all sampled entities, namespaces.json, resolve objects, default lists, and a sampled lineage index.`,
        )
    } catch (e) {
        console.error(e)
        process.exit(1)
    } finally {
        await client.end()
    }
})()
