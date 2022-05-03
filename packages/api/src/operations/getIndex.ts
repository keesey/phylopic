import { DataParameters } from "@phylopic/api-models"
import { APIGatewayProxyResult } from "aws-lambda"
import BUILD from "../build/BUILD"
import checkBuild from "../build/checkBuild"
import createBuildRedirect from "../build/createBuildRedirect"
import { DataRequestHeaders } from "../headers/requests/DataRequestHeaders"
import DATA_HEADERS from "../headers/responses/DATA_HEADERS"
import PERMANENT_HEADERS from "../headers/responses/PERMANENT_HEADERS"
import checkAccept from "../mediaTypes/checkAccept"
import DATA_MEDIA_TYPE from "../mediaTypes/DATA_MEDIA_TYPE"
import { Operation } from "./Operation"
export type GetRootParameters = DataRequestHeaders & DataParameters
const BODY = `{"_links":{"contact":{"href":"mailto:keesey+phylopic@gmail.com","title":"Mike Keesey"},"documentation":{"href":"https://api-docs.phylopic.org/versions/2.0"},"resources":[{"href":"/autocomplete?build=${BUILD}","title":"Autocomplete for Phylogenetic Nodes"},{"href":"/contributors?build=${BUILD}","title":"Image Contributors"},{"href":"/images?build=${BUILD}","title":"Silhouette Images"},{"href":"/licenses?build=${BUILD}","title":"Licenses for New Submissions"},{"href":"/nodes?build=${BUILD}","title":"Phylogenetic Nodes"},{"href":"/ping","title":"API Check"},{"href":"/root?build=${BUILD}","title":"Phylogenetic Root Node"}],"self":{"href":"/?build=${BUILD}"}},"build":${BUILD},"buildTimestamp":${JSON.stringify(
    process.env.PHYLOPIC_BUILD_TIMESTAMP,
)},"title":"PhyloPic Application Programming Interface","version":"2.0.0-alpha"}`
const RESULT_200: APIGatewayProxyResult = {
    body: BODY,
    headers: { ...DATA_HEADERS, ...PERMANENT_HEADERS },
    statusCode: 200,
}
export const getIndex: Operation<GetRootParameters> = async ({ accept, ...queryParameters }) => {
    checkAccept(accept, DATA_MEDIA_TYPE)
    if (!queryParameters.build) {
        return createBuildRedirect("/", queryParameters)
    }
    checkBuild(queryParameters.build)
    return RESULT_200
}
export default getIndex
