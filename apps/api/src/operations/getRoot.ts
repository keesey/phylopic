import {
    DATA_MEDIA_TYPE,
    type DataParameters,
    type EmbeddableParameters,
    type NodeEmbedded,
} from "@phylopic/api-models"
import { EMPTY_UUID, type UUID } from "@phylopic/utils"
import createBuildRedirect from "../build/createBuildRedirect"
import type { DataRequestHeaders } from "../headers/requests/DataRequestHeaders"
import checkAccept from "../mediaTypes/checkAccept"
import createPermanentRedirect from "../results/createPermanentRedirect"
import type { Operation } from "./Operation"

type GetRootParameters = DataRequestHeaders & DataParameters & EmbeddableParameters<NodeEmbedded>

const ROOT_NODE_UUID: UUID = process.env.PHYLOPIC_ROOT_UUID ?? EMPTY_UUID

const ROOT_NODE_PATH = `/nodes/${encodeURIComponent(ROOT_NODE_UUID)}`

const getRoot: Operation<GetRootParameters> = async ({ accept, ...queryParameters }) => {
    checkAccept(accept, DATA_MEDIA_TYPE)
    if (!queryParameters.build) {
        return createBuildRedirect(ROOT_NODE_PATH, queryParameters)
    }
    return createPermanentRedirect(ROOT_NODE_PATH, queryParameters)
}

export default getRoot
