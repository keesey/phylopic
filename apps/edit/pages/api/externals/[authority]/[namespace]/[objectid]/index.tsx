import { External } from "@phylopic/source-models"
import { Authority, isAuthority, isNamespace, isObjectID, Namespace, ObjectID } from "@phylopic/utils"
import { NextApiHandler } from "next"
import handleAPIError from "~/api/handleAPIError"
import handleWithEditor from "~/api/handleWithEditor"
import SourceClient from "~/source/SourceClient"
const index: NextApiHandler<External & { authority: Authority; namespace: Namespace; objectID: ObjectID }> = async (
    req,
    res,
) => {
    let client: SourceClient | undefined
    try {
        const { authority, namespace, objectid } = req.query
        if (!isAuthority(authority) || !isNamespace(namespace) || !isObjectID(objectid)) {
            throw 404
        }
        client = new SourceClient()
        await handleWithEditor(req, res, client.external(authority, namespace, objectid))
    } catch (e) {
        handleAPIError(res, e)
    } finally {
        await client?.destroy()
    }
    res.end()
}
export default index
