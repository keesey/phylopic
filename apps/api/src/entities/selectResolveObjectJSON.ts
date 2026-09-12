import { Authority, Namespace, ObjectID } from "@phylopic/utils"
import ENTITY_JSON_SOURCE from "./ENTITY_JSON_SOURCE"
import selectResolveObjectJSONFromS3 from "./selectResolveObjectJSONFromS3"

const selectResolveObjectJSON = async (
    authority: Authority,
    namespace: Namespace,
    objectID: ObjectID,
): Promise<string | null> => {
    if (ENTITY_JSON_SOURCE === "postgres") {
        return null
    }
    return selectResolveObjectJSONFromS3(authority, namespace, objectID)
}

export default selectResolveObjectJSON
