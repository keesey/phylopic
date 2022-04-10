import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { Image } from "../phylopicv1/models/Image"
import getImage from "../transport/getImage"

const migrateSourceFile = async (client: S3Client, image: Image, Bucket: string, Key: string) => {
    const isSVG = typeof image.svgFile?.url === "string"
    const path = isSVG ? image.svgFile.url : image.pngFiles[image.pngFiles.length - 1].url
    console.info(`Copying ${path} to ${Key}`)
    const source = await getImage(`http://phylopic.org${path}`, !isSVG)
    const command = new PutObjectCommand({
        Body: source,
        Bucket,
        ContentType: isSVG ? "image/svg+xml" : "image/png",
        Key,
    })
    const output = await client.send(command)
    const status = output.$metadata.httpStatusCode
    if (status === undefined || status >= 400) {
        throw new Error(`HTTP Error ${output.$metadata.httpStatusCode}`)
    }
    console.info("Image source copied.")
}
export default migrateSourceFile
