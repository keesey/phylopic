import {
    DeleteObjectCommand,
    GetObjectCommand,
    GetObjectCommandOutput,
    PutObjectCommand,
    S3Client,
} from "@aws-sdk/client-s3"
import { CONTRIBUTE_BUCKET_NAME, findImageSourceFile } from "@phylopic/source-models"
import {
    EmailAddress,
    ImageMediaType,
    isEmailAddress,
    isImageMediaType,
    isUUID,
    normalizeUUID,
    UUID,
} from "@phylopic/utils"
import { objectExists } from "@phylopic/utils-aws"
import { NextApiHandler, NextApiRequest, NextApiResponse, NextConfig } from "next"
import type { Readable } from "stream"

const deleteFile = async (client: S3Client, contributor: EmailAddress, uuid: UUID, res: NextApiResponse) => {
    const file = await findImageSourceFile(
        client,
        CONTRIBUTE_BUCKET_NAME,
        `contributors/${encodeURIComponent(contributor)}/images/${uuid}/source.`,
    )
    if (!file?.Key) {
        return res.status(404).end()
    }
    try {
        await client.send(
            new DeleteObjectCommand({
                Bucket: CONTRIBUTE_BUCKET_NAME,
                Key: file.Key,
            }),
        )
    } catch (e) {
        console.error(e)
        // :TODO: check status of error
        return res.status(400).end()
    }
    res.status(204).end()
}
const getContentType = (filename?: string) => {
    const extension = filename?.match(/\.([^.]+)$/)?.[1]
    switch (extension) {
        case "png": {
            return "image/png"
        }
        case "svg": {
            return "image/svg+xml"
        }
        default: {
            throw new Error(`Invalid extension: ${extension}.`)
        }
    }
}
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
const getFilename = (uuid: UUID, key: string) => uuid + key.slice(key.lastIndexOf("."))
const getKey = (contributor: EmailAddress, uuid: UUID, contentType: ImageMediaType | undefined) => {
    if (!contentType) {
        return null
    }
    switch (contentType) {
        case "image/svg+xml": {
            return `contributors/${encodeURIComponent(contributor)}/images/${uuid}/source.svg`
        }
        case undefined: {
            return `contributors/${encodeURIComponent(contributor)}/images/${uuid}/source.png`
        }
        default: {
            return `contributors/${encodeURIComponent(contributor)}/images/${uuid}/source.${contentType.replace(
                "image/",
                "",
            )}`
        }
    }
}
const get = async (
    client: S3Client,
    contributor: EmailAddress,
    uuid: UUID,
    download: boolean,
    res: NextApiResponse,
) => {
    const file = await findImageSourceFile(
        client,
        CONTRIBUTE_BUCKET_NAME,
        `contributors/${encodeURIComponent(contributor)}/images/${uuid}/source.`,
    )
    if (!file?.Key) {
        return res.status(404)
    }
    const getCommand = new GetObjectCommand({
        Bucket: CONTRIBUTE_BUCKET_NAME,
        Key: file.Key,
    })
    let getResult: GetObjectCommandOutput
    try {
        getResult = await client.send(getCommand)
    } catch (e) {
        console.error(e)
        // :TODO: check status of error
        return res.status(404)
    }
    res.status(200).setHeader("Content-Type", getContentType(file.Key))
    if (download) {
        res.setHeader("Content-Disposition", `attachment; filename="${getFilename(uuid, file.Key)}"`)
    }
    await writeToReponse(getResult.Body, res)
}
const head = async (
    client: S3Client,
    contributor: EmailAddress,
    uuid: UUID,
    download: boolean,
    res: NextApiResponse,
) => {
    const file = await findImageSourceFile(
        client,
        CONTRIBUTE_BUCKET_NAME,
        `contributors/${encodeURIComponent(contributor)}/images/${uuid}/source.`,
    )
    if (!file?.Key) {
        return res.status(404)
    }
    res.status(200).setHeader("Content-Type", getContentType(file.Key))
    if (download) {
        res.setHeader("Content-Disposition", `attachment; filename="${getFilename(uuid, file.Key)}"`)
    }
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
const put = async (
    client: S3Client,
    contributor: EmailAddress,
    uuid: UUID,
    req: NextApiRequest,
    res: NextApiResponse,
) => {
    const path = `contributors/${encodeURIComponent(contributor)}/images/${uuid}/`
    if (
        !(await objectExists(client, {
            Bucket: CONTRIBUTE_BUCKET_NAME,
            Key: `${path}meta.json`,
        }))
    ) {
        return res.status(404)
    }
    const existingFile = await findImageSourceFile(client, CONTRIBUTE_BUCKET_NAME, `${path}source.`)
    const ContentType = req.headers["content-type"]
    if (!isImageMediaType(ContentType)) {
        return res.status(400)
    }
    const newKey = getKey(contributor, uuid, ContentType)
    if (!newKey) {
        return res.status(415)
    }
    const command = new PutObjectCommand({
        Body: await streamToBuffer(req),
        Bucket: CONTRIBUTE_BUCKET_NAME,
        ContentType,
        Key: newKey,
    })
    console.info("Uploading image file...")
    const output = await client.send(command)
    const status = output.$metadata.httpStatusCode
    if (status === undefined || status >= 400) {
        return res.status(status ?? 500)
    }
    if (existingFile?.Key && newKey !== existingFile.Key) {
        console.info("Deleting old image file...")
        await client.send(
            new DeleteObjectCommand({
                Bucket: CONTRIBUTE_BUCKET_NAME,
                Key: existingFile.Key,
            }),
        )
    }
    res.status(201)
}
const imagefile: NextApiHandler = async (req, res) => {
    const mediaTypes: ImageMediaType[] = ["image/bmp", "image/gif", "image/jpeg", "image/png", "image/svg+xml"]
    res.setHeader("Accept", mediaTypes.join(", ")).setHeader("Accept-Encoding", "identity")
    if (typeof req.query.contributor !== "string" || typeof req.query.uuid !== "string") {
        res.status(404)
        return
    }
    if (!isEmailAddress(req.query.contributor) || !isUUID(req.query.uuid)) {
        res.status(404)
        return
    }
    const contributor = req.query.contributor
    const uuid = normalizeUUID(req.query.uuid)
    const client = new S3Client({})
    try {
        switch (req.method) {
            case "DELETE": {
                await deleteFile(client, contributor, uuid, res)
                break
            }
            case "GET": {
                await get(client, contributor, uuid, req.query.download === "1", res)
                break
            }
            case "HEAD": {
                await head(client, contributor, uuid, req.query.download === "1", res)
                break
            }
            case "PUT": {
                await put(client, contributor, uuid, req, res)
                break
            }
            default: {
                res.status(405)
            }
        }
    } finally {
        client.destroy()
        res.end()
    }
}
export default imagefile
export const config: NextConfig = {
    api: {
        bodyParser: false,
    },
}
