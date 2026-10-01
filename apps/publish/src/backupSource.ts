import "dotenv/config"
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { spawn } from "child_process"
import { mkdtemp, readFile, rm } from "fs/promises"
import { tmpdir } from "os"
import { join } from "path"

const BUCKET = "source-backup.phylopic.org"
const BUCKET_REGION = "us-east-1"
const DATABASE = "phylopic-source"

const run = (command: string, args: readonly string[]) =>
    new Promise<string>((resolve, reject) => {
        const child = spawn(command, args, { env: process.env, stdio: ["ignore", "pipe", "inherit"] })
        let stdout = ""
        child.stdout.on("data", (chunk: Buffer) => {
            stdout += chunk.toString()
        })
        child.on("error", reject)
        child.on("close", code => {
            if (code === 0) {
                resolve(stdout)
            } else {
                reject(new Error(`${command} exited with code ${code}.`))
            }
        })
    })

const checkDump = async (path: string) => {
    const listing = await run("pg_restore", ["--list", path])
    if (!/ TABLE DATA /.test(listing)) {
        throw new Error(`Dump of ${DATABASE} contains no table data.`)
    }
}

const upload = async (client: S3Client, key: string, body: Buffer) => {
    await client.send(
        new PutObjectCommand({
            Body: body,
            Bucket: BUCKET,
            ContentType: "application/octet-stream",
            Key: key,
            ServerSideEncryption: "AES256",
        }),
    )
    console.info(`Uploaded s3://${BUCKET}/${key}`)
}

const backupSource = async () => {
    const dir = await mkdtemp(join(tmpdir(), "phylopic-source-backup-"))
    try {
        const path = join(dir, `${DATABASE}.dump`)
        console.info(`Dumping ${DATABASE}...`)
        await run("pg_dump", [
            "--format=custom",
            "--no-owner",
            "--no-privileges",
            `--dbname=${DATABASE}`,
            `--file=${path}`,
        ])
        await checkDump(path)
        const body = await readFile(path)
        console.info(`Dumped ${DATABASE} (${(body.length / 1024 / 1024).toFixed(1)} MB).`)
        const timestamp = new Date()
            .toISOString()
            .replace(/\.\d+Z$/, "Z")
            .replace(/:/g, "-")
        const client = new S3Client({ region: BUCKET_REGION })
        await upload(client, `dumps/${DATABASE}-${timestamp}.dump`, body)
        await upload(client, `monthly/${DATABASE}-${timestamp.slice(0, 7)}.dump`, body)
    } finally {
        await rm(dir, { force: true, recursive: true })
    }
}

;(async () => {
    try {
        await backupSource()
        process.exit(0)
    } catch (e) {
        console.error(e)
        process.exit(1)
    }
})()
