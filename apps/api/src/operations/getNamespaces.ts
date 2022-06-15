import { AuthorizedNamespace, DataParameters, DATA_MEDIA_TYPE } from "@phylopic/api-models"
import { stringifyNormalized } from "@phylopic/utils"
import checkBuild from "../build/checkBuild"
import createBuildRedirect from "../build/createBuildRedirect"
import { DataRequestHeaders } from "../headers/requests/DataRequestHeaders"
import DATA_HEADERS from "../headers/responses/DATA_HEADERS"
import PERMANENT_HEADERS from "../headers/responses/PERMANENT_HEADERS"
import checkAccept from "../mediaTypes/checkAccept"
import { PgClientService } from "../services/PgClientService"
import { Operation } from "./Operation"
export type GetNamespaceParameters = DataRequestHeaders & DataParameters
export type GetNamespacesService = PgClientService
export const getNamespaces: Operation<GetNamespaceParameters, GetNamespacesService> = async (
    { accept, ...queryParameters },
    service,
) => {
    checkAccept(accept, DATA_MEDIA_TYPE)
    if (!queryParameters.build) {
        return createBuildRedirect("/namespaces", queryParameters)
    }
    checkBuild(queryParameters.build)
    const client = await service.createPgClient()
    let namespaces: AuthorizedNamespace[]
    try {
        const queryResult = await client.query<AuthorizedNamespace>(
            'SELECT authority,"namespace" FROM node_external GROUP BY authority,"namespace" ORDER BY authority,"namespace"',
        )
        namespaces = queryResult.rows
    } finally {
        await service.deletePgClient(client)
    }
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
