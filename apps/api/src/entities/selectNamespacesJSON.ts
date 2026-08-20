import ENTITY_JSON_SOURCE from "./ENTITY_JSON_SOURCE"
import selectStaticJSONFromS3 from "./selectStaticJSONFromS3"

const selectNamespacesJSON = async (): Promise<string | null> => {
    if (ENTITY_JSON_SOURCE === "postgres") {
        return null
    }
    return selectStaticJSONFromS3("namespaces")
}

export default selectNamespacesJSON
