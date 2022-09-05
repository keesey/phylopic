import { Editable, ImageFile, Patchable } from "@phylopic/source-client"
import { Image } from "@phylopic/source-models"
import { isImageMediaType, UUID } from "@phylopic/utils"
import { convertS3BodyToBuffer } from "@phylopic/utils-aws"
import { NextApiRequest, NextApiResponse } from "next"
import getImageFilename from "~/files/getImageFilename"
const handleWithImageFileEditor = async (
    req: NextApiRequest,
    res: NextApiResponse<Buffer>,
    editor: Editable<ImageFile>,
    imageClient: Patchable<Image & { uuid: UUID }>,
) => {
    const now = new Date()
    switch (req.method) {
        case "DELETE": {
            await editor.delete()
            res.status(204)
            break
        }
        case "GET":
        case "HEAD": {
            let imagePromise: Promise<Image & { uuid: UUID }> | null = null
            if (req.query.download) {
                imagePromise = imageClient.get()
            }
            const { data, type } = await editor.get()
            const image = await imagePromise
            if (image) {
                res.setHeader(
                    "content-disposition",
                    `attachment; filename=${JSON.stringify(getImageFilename(image, type))}`,
                )
            }
            res.setHeader("content-type", type)
            res.send(data)
            res.status(200)
            break
        }
        case "OPTIONS": {
            res.setHeader("allow", "DELETE, GET, HEAD, OPTIONS, PUT")
            res.status(204)
            break
        }
        case "PUT": {
            const type = req.headers["content-type"]
            if (!isImageMediaType(type)) {
                throw 415
            }
            await editor.put({
                data: await convertS3BodyToBuffer(req.body),
                type,
            })
            await imageClient.patch({ modified: now.toISOString() })
            res.status(204)
            break
        }
        default: {
            throw 405
        }
    }
}
export default handleWithImageFileEditor
