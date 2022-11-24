import { Collection, CollectionParameters, DATA_MEDIA_TYPE, isCollectionParameters } from "@phylopic/api-models"
import { EMPTY_UUID, stringifyNormalized, UUID } from "@phylopic/utils"
import { APIGatewayProxyResult } from "aws-lambda"
import APIError from "../errors/APIError"
import { DataRequestHeaders } from "../headers/requests/DataRequestHeaders"
import DATA_HEADERS from "../headers/responses/DATA_HEADERS"
import checkAccept from "../mediaTypes/checkAccept"
import { PgClientService } from "../services/PgClientService"
import validate from "../validation/validate"
import { Operation } from "./Operation"
const USER_MESSAGE = "There was a problem with an attempt to load a collection."
export type GetCollectionParameters = DataRequestHeaders & Partial<CollectionParameters>
export type GetCollectionService = PgClientService
const ensureExistence = async (service: PgClientService, uuid: string) => {
    if (uuid !== EMPTY_UUID) {
        const client = await service.createPgClient()
        try {
            const result = await client.query<{ uuid: UUID }>(
                "SELECT uuid FROM collection WHERE uuid=$1::uuid LIMIT 1",
                [uuid],
            )
            if (!result.rowCount) {
                throw new APIError(404, [
                    {
                        developerMessage: "Cannot find collection.",
                        field: "uuid",
                        type: "RESOURCE_NOT_FOUND",
                        userMessage: "That collection could not be found.",
                    },
                ])
            }
        } finally {
            await service.deletePgClient(client)
        }
    }
}
export const getCollection: Operation<GetCollectionParameters, GetCollectionService> = async (
    { accept, ...queryAndPathParameters },
    service,
) => {
    checkAccept(accept, DATA_MEDIA_TYPE)
    if (validate(queryAndPathParameters, isCollectionParameters, USER_MESSAGE)) {
        const { uuid } = queryAndPathParameters
        await ensureExistence(service, uuid)
        const uuidEncoded = encodeURIComponent(uuid)
        const query = `?filter_collection=${uuidEncoded}`
        const collection: Collection = {
            _links: {
                contributors: { href: `/contributors${query}` },
                images: { href: `/images${query}` },
                nodes: { href: `/nodes${query}` },
                self: { href: `/collections/${uuidEncoded}` },
            },
            uuid,
        }
        return {
            body: stringifyNormalized(collection),
            headers: DATA_HEADERS,
            statusCode: 200,
        } as APIGatewayProxyResult
    }
    // Unreachable.
    throw new Error()
}
export default getCollection
