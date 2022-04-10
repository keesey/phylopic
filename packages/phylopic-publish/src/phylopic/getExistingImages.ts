import { ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3"
import { Image } from "../phylopicv1/models/Image"
export type Locator = Readonly<{
    Bucket: string
    getPrefix: (image: Image) => string
}>
const filterImages = (x: Image | null): x is Image => Boolean(x)
const getExistingImages = async (
    client: S3Client,
    images: readonly Image[],
    locators: readonly Locator[],
): Promise<readonly Image[]> => {
    if (!images.length) {
        return []
    }
    return (
        await Promise.all<Image | null>(
            images.map(async image => {
                const existences = await Promise.all(
                    locators.map(async ({ Bucket, getPrefix }) => {
                        const result = await client.send(
                            new ListObjectsV2Command({
                                Bucket,
                                MaxKeys: 1,
                                Prefix: getPrefix(image),
                            }),
                        )
                        return Boolean(result.Contents?.length)
                    }),
                )
                return existences.includes(true) ? image : null
            }),
        )
    ).filter(filterImages)
}
export default getExistingImages
