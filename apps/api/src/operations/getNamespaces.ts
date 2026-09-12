import { AuthorizedNamespace, DataParameters, DATA_MEDIA_TYPE } from "@phylopic/api-models"
import { stringifyNormalized } from "@phylopic/utils"
import checkBuild from "../build/checkBuild"
import createBuildRedirect from "../build/createBuildRedirect"
import ENTITY_JSON_SOURCE from "../entities/ENTITY_JSON_SOURCE"
import selectNamespacesJSON from "../entities/selectNamespacesJSON"
import { DataRequestHeaders } from "../headers/requests/DataRequestHeaders"
import DATA_HEADERS from "../headers/responses/DATA_HEADERS"
import PERMANENT_HEADERS from "../headers/responses/PERMANENT_HEADERS"
import checkAccept from "../mediaTypes/checkAccept"
import { PgClientService } from "../services/PgClientService"
import { Operation } from "./Operation"

export type GetNamespaceParameters = DataRequestHeaders & DataParameters
export type GetNamespacesService = PgClientService

const USER_MESSAGE = "There was a problem with a request for namespace data."

const selectNamespacesFromPostgres = async (service: PgClientService): Promise<readonly AuthorizedNamespace[]> => {
    const client = await service.createPgClient()
    try {
        const queryResult = await client.query<AuthorizedNamespace>(
            'SELECT authority,"namespace" FROM node_external GROUP BY authority,"namespace" ORDER BY authority,"namespace"',
        )
        return queryResult.rows
    } finally {
        await service.deletePgClient(client)
    }
}

export const getNamespaces: Operation<GetNamespaceParameters, GetNamespacesService> = async (
    { accept, ...queryParameters },
    service,
) => {
    checkAccept(accept, DATA_MEDIA_TYPE)
    if (!queryParameters.build) {
        return createBuildRedirect("/namespaces", queryParameters)
    }
    checkBuild(queryParameters.build, USER_MESSAGE)
    if (ENTITY_JSON_SOURCE !== "postgres") {
        const body = await selectNamespacesJSON()
        if (body !== null) {
            return {
                body,
                headers: { ...DATA_HEADERS, ...PERMANENT_HEADERS },
                statusCode: 200,
            }
        }
        if (ENTITY_JSON_SOURCE === "s3") {
            console.warn("Namespaces JSON is missing from S3; falling back to Postgres.")
        }
    }
    const namespaces = await selectNamespacesFromPostgres(service)
    return {
        body: stringifyNormalized({
            build: queryParameters.build,
            namespaces,
        }),
        headers: { ...DATA_HEADERS, ...PERMANENT_HEADERS },
        statusCode: 200,
    }
}

export default getNamespaces
