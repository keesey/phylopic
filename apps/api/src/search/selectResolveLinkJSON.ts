import { Authority, Namespace, ObjectID } from "@phylopic/utils"
import BUILD from "../build/BUILD"
import { getResolveJSONKey } from "@phylopic/s3-entities"
import selectJSONFromS3Entities from "../entities/selectJSONFromS3Entities"
import APIError from "../errors/APIError"
import mergeResolveLinkQuery from "./mergeResolveLinkQuery"
import type { S3ClientService } from "../services/S3ClientService"
import withS3Client from "../services/withS3Client"

const USER_MESSAGE = "There was a problem with an attempt to find taxonomic data."

const selectResolveLinkJSON = async (
    service: S3ClientService,
    authority: Authority,
    namespace: Namespace,
    objectID: ObjectID,
    queryParameters: Readonly<Record<string, string | number | boolean | undefined>>,
): Promise<string> => {
    const body = await withS3Client(service, client =>
        selectJSONFromS3Entities(client, getResolveJSONKey(BUILD, authority, namespace, objectID)),
    )
    if (body === null) {
        throw new APIError(404, [
            {
                developerMessage: "Resolve JSON is missing from S3.",
                field: "objectID",
                type: "RESOURCE_NOT_FOUND",
                userMessage: USER_MESSAGE,
            },
        ])
    }
    return mergeResolveLinkQuery(body, queryParameters)
}

export default selectResolveLinkJSON
