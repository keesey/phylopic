import { Editable, ImageFile } from "@phylopic/source-client"
import { isImageMediaType } from "@phylopic/utils"
import { convertS3BodyToBuffer } from "@phylopic/utils-aws"
import { NextApiRequest, NextApiResponse } from "next"
const handleWithImageFileEditor = async (
    req: NextApiRequest,
    res: NextApiResponse<Buffer>,
    editor: Editable<ImageFile>,
) => {
    switch (req.method) {
        case "DELETE": {
            await editor.delete()
            res.status(204)
            break
        }
        case "GET":
        case "HEAD": {
            const { data, type } = await editor.get()
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
            res.status(204)
            break
        }
        default: {
            throw 405
        }
    }
}
export default handleWithImageFileEditor
