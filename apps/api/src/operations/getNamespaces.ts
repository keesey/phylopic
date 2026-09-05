import { DATA_MEDIA_TYPE, DataParameters } from "@phylopic/api-models"
import checkBuild from "../build/checkBuild"
import createBuildRedirect from "../build/createBuildRedirect"
import { getStaticJSONKey } from "@phylopic/s3-entities"
import BUILD from "../build/BUILD"
import getS3EntityJSON from "../entities/getS3EntityJSON"
import APIError from "../errors/APIError"
import { DataRequestHeaders } from "../headers/requests/DataRequestHeaders"
import DATA_HEADERS from "../headers/responses/DATA_HEADERS"
import PERMANENT_HEADERS from "../headers/responses/PERMANENT_HEADERS"
import checkAccept from "../mediaTypes/checkAccept"
import type { S3ClientService } from "../services/S3ClientService"
import withS3Client from "../services/withS3Client"
import { Operation } from "./Operation"

export type GetNamespaceParameters = DataRequestHeaders & DataParameters

export type GetNamespacesService = S3ClientService

const USER_MESSAGE = "There was a problem with a request for namespace data."

export const getNamespaces: Operation<GetNamespaceParameters, GetNamespacesService> = async (
    { accept, ...queryParameters },
    service,
) => {
    checkAccept(accept, DATA_MEDIA_TYPE)
    if (!queryParameters.build) {
        return createBuildRedirect("/namespaces", queryParameters)
    }
    checkBuild(queryParameters.build, USER_MESSAGE)
    const body = await withS3Client(service, client => getS3EntityJSON(client, getStaticJSONKey(BUILD, "namespaces")))
    if (body === null) {
        throw new APIError(500, [
            {
                developerMessage: "Namespaces JSON is missing from S3.",
                field: "build",
                type: "DEFAULT_5XX",
                userMessage: USER_MESSAGE,
            },
        ])
    }
    return {
        body,
        headers: { ...DATA_HEADERS, ...PERMANENT_HEADERS },
        statusCode: 200,
    }
}

export default getNamespaces
