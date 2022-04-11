import { Namespace, ObjectID, TitledLink, validateEmailAddress, validateUUIDv4 } from "phylopic-api-types"
import APIError from "../errors/APIError"
import normalizeUUIDv4 from "../utils/uuid/normalizeUUIDv4"
import checkValidation from "../validation/checkValidation"
const getInternalLink = (namespace: Namespace, objectID: ObjectID): TitledLink => {
    switch (namespace) {
        case "contributors": {
            checkValidation(
                validateEmailAddress(objectID, "objectID"),
                "There was a problem in a request to find a contributor.",
            )
            return {
                href: `/contributors/${encodeURIComponent(objectID)}`,
                title: objectID,
            }
        }
        case "images":
        case "nodes": {
            checkValidation(validateUUIDv4(objectID, "objectID"), "There was a problem in a request to find an entity.")
            return {
                href: `/${namespace}/${normalizeUUIDv4(objectID, namespace)}`,
                title: { images: "Silhouette Image", nodes: "Taxonomic Group" }[namespace],
            }
        }
        default: {
            throw new APIError(400, [
                {
                    developerMessage: "Unrecognized namespace.",
                    type: "BAD_REQUEST_PARAMETERS",
                    userMessage: "There was a problem in a request to find an entity.",
                    field: "namespace",
                },
            ])
        }
    }
}
export default getInternalLink
