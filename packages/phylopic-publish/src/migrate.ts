import { S3Client } from "@aws-sdk/client-s3"
import "dotenv/config"
import { normalizeUUID } from "phylopic-source-models/src"
import findNextImage from "./phylopicv1/findNextImage"
import getEmailFromSubmitter from "./phylopicv1/getEmailFromSubmitter"
import login from "./phylopicv1/login"
import { Image } from "./phylopicv1/models/Image"
import getExistingImages from "./phylopicv2/getExistingImages"
import migrateSubmission from "./phylopicv2/migrateSubmission"
    ; (async () => {
        const client = new S3Client({})
        try {
            const sessionID = await login()
            if (!sessionID) {
                throw new Error("Could not log in!")
            }
            let image: Image | null = null
            const errorImages: Image[] = []
            do {
                image = await findNextImage(
                    async (images, locators) => [...errorImages, ...(await getExistingImages(client, images, locators))],
                    undefined,
                    [
                        {
                            Bucket: "submissions.phylopic.org",
                            getPrefix: candidate =>
                                `contributors/${encodeURIComponent(
                                    getEmailFromSubmitter(candidate),
                                )}/images/${encodeURIComponent(normalizeUUID(candidate.uid))}/meta.json`,
                        },
                        {
                            Bucket: "source.phylopic.org",
                            getPrefix: candidate => `images/${encodeURIComponent(normalizeUUID(candidate.uid))}/meta.json`,
                        },
                    ],
                    sessionID,
                )
                if (image) {
                    try {
                        await migrateSubmission(client, image)
                    } catch (e) {
                        errorImages.push(image)
                        console.warn(`Error migrating image. See: http://phylopic.org/image/${image.uid}`)
                        console.error(e)
                    }
                }
            } while (image)
        } catch (e) {
            console.error(e)
            process.exit(1)
        } finally {
            client.destroy()
        }
        process.exit(0)
    })()
