import {
    DeleteObjectCommand,
    GetObjectCommand,
    GetObjectCommandOutput,
    PutObjectCommand,
    S3Client,
} from "@aws-sdk/client-s3"
import { findImageSourceFile, SOURCE_BUCKET_NAME } from "@phylopic/source-models"
import { ImageMediaType, isImageMediaType, normalizeUUID, UUID } from "@phylopic/utils"
import { objectExists } from "@phylopic/utils-aws"
import { NextApiHandler, NextApiRequest, NextApiResponse, NextConfig } from "next"
import type { Readable } from "stream"
import getImageMediaTypeFromFileName from "~/utils/getImageMediaTypeFromFileName"

const writeToReponse = async (body: GetObjectCommandOutput["Body"], res: NextApiResponse) =>
    new Promise<void>((resolve, reject) => {
        if (!body) {
            reject(new Error("No content."))
        }
        const stream = body as Readable
        stream.on("error", reject)
        stream.on("end", resolve)
        stream.pipe(res)
    })
const getFilename = (uuid: string, key: string) => uuid + key.slice(key.lastIndexOf("."))
const getKey = (uuid: UUID, contentType: string | undefined) => {
    if (!isImageMediaType(contentType)) {
        return null
    }
    if (contentType === "image/svg+xml") {
        return `images/${uuid}/source.svg`
    }
    const [, extension] = contentType.split("/", 2)
    return `images/${uuid}/source.${extension}`
}
const get = async (client: S3Client, uuid: string, download: boolean, res: NextApiResponse) => {
    const file = await findImageSourceFile(client, SOURCE_BUCKET_NAME, `images/${uuid}/source.`)
    if (!file?.Key) {
        return res.status(404).end()
    }
    const getCommand = new GetObjectCommand({
        Bucket: SOURCE_BUCKET_NAME,
        Key: file.Key,
    })
    let getResult: GetObjectCommandOutput
    try {
        getResult = await client.send(getCommand)
    } catch (e) {
        console.error(e)
        // :TODO: check status of error
        return res.status(404).end()
    }
    res.status(200).setHeader("Content-Type", getImageMediaTypeFromFileName(file.Key))
    if (download) {
        res.setHeader("Content-Disposition", `attachment; filename="${getFilename(uuid, file.Key)}"`)
    }
    await writeToReponse(getResult.Body, res)
    res.end()
}
const head = async (client: S3Client, uuid: string, download: boolean, res: NextApiResponse) => {
    const file = await findImageSourceFile(client, SOURCE_BUCKET_NAME, `images/${uuid}/source.`)
    if (!file?.Key) {
        return res.status(404).end()
    }
    res.status(200).setHeader("Content-Type", getImageMediaTypeFromFileName(file.Key))
    if (download) {
        res.setHeader("Content-Disposition", `attachment; filename="${getFilename(uuid, file.Key)}"`)
    }
    res.end()
}
const streamToBuffer = async (stream: Readable) =>
    new Promise<Buffer>((resolve, reject) => {
        console.info("Converting stream to buffer...")
        const list: Uint8Array[] = []
        stream.on("data", chunk => list.push(chunk))
        stream.on("end", () => {
            console.info("Done converting.")
            resolve(Buffer.concat(list))
        })
        stream.on("error", reject)
    })
const put = async (client: S3Client, uuid: string, req: NextApiRequest, res: NextApiResponse) => {
    if (
        !(await objectExists(client, {
            Bucket: SOURCE_BUCKET_NAME,
            Key: `images/${uuid}/meta.json`,
        }))
    ) {
        return res.status(404).end()
    }
    const existingFile = await findImageSourceFile(client, SOURCE_BUCKET_NAME, `images/${uuid}/source.`)
    const ContentType = req.headers["content-type"]
    const newKey = getKey(uuid, ContentType)
    if (!newKey) {
        return res.status(415).end()
    }
    const command = new PutObjectCommand({
        Body: await streamToBuffer(req),
        Bucket: SOURCE_BUCKET_NAME,
        ContentType,
        Key: newKey,
    })
    console.info("Uploading image file...")
    const output = await client.send(command)
    const status = output.$metadata.httpStatusCode
    if (status === undefined || status >= 400) {
        return res.status(status ?? 500).end()
    }
    if (existingFile?.Key && newKey !== existingFile.Key) {
        console.info("Deleting old image file...")
        await client.send(
            new DeleteObjectCommand({
                Bucket: SOURCE_BUCKET_NAME,
                Key: existingFile.Key,
            }),
        )
    }
    res.status(201).end()
}
const imagefile: NextApiHandler<void> = async (req, res) => {
    const mediaTypes: ImageMediaType[] = ["image/bmp", "image/gif", "image/jpeg", "image/png", "image/svg+xml"]
    res.setHeader("Accept", mediaTypes.join(", ")).setHeader("Accept-Encoding", "identity")
    if (typeof req.query.uuid !== "string") {
        res.status(404).end()
        return
    }
    const uuid = normalizeUUID(req.query.uuid)
    const client = new S3Client({})
    try {
        switch (req.method) {
            case "GET": {
                await get(client, uuid, req.query.download === "1", res)
                break
            }
            case "HEAD": {
                await head(client, uuid, req.query.download === "1", res)
                break
            }
            case "PUT": {
                await put(client, uuid, req, res)
                break
            }
            default: {
                res.status(405).end()
            }
        }
    } finally {
        client.destroy()
    }
}
export default imagefile
export const config: NextConfig = {
    api: {
        bodyParser: false,
    },
}
