import { DataParameters } from "phylopic-api-models"
import { EmbeddableParameters, NodeEmbedded } from "phylopic-api-models"
import { UUID } from "phylopic-utils"
import createBuildRedirect from "../build/createBuildRedirect"
import { DataRequestHeaders } from "../headers/requests/DataRequestHeaders"
import checkAccept from "../mediaTypes/checkAccept"
import DATA_MEDIA_TYPE from "../mediaTypes/DATA_MEDIA_TYPE"
import createPermanentRedirect from "../results/createPermanentRedirect"
import { Operation } from "./Operation"
export type GetRootParameters = DataRequestHeaders & DataParameters & EmbeddableParameters<NodeEmbedded>
const ROOT_NODE_UUID: UUID = process.env.PHYLOPIC_ROOT_UUID ?? "00000000-0000-0000-0000-000000000000"
const ROOT_NODE_PATH = `/nodes/${encodeURIComponent(ROOT_NODE_UUID)}`
export const getRoot: Operation<GetRootParameters> = async ({ accept, ...queryParameters }) => {
    checkAccept(accept, DATA_MEDIA_TYPE)
    if (!queryParameters.build) {
        return createBuildRedirect(ROOT_NODE_PATH, queryParameters)
    }
    return createPermanentRedirect(ROOT_NODE_PATH, queryParameters)
}
export default getRoot
