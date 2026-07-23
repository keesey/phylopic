import { DATA_MEDIA_TYPE, DataParameters } from "@phylopic/api-models"
import { APIGatewayProxyResult } from "aws-lambda"
import pkg from "../../package.json"
import BUILD from "../build/BUILD"
import checkBuild from "../build/checkBuild"
import createBuildRedirect from "../build/createBuildRedirect"
import { DataRequestHeaders } from "../headers/requests/DataRequestHeaders"
import DATA_HEADERS from "../headers/responses/DATA_HEADERS"
import PERMANENT_HEADERS from "../headers/responses/PERMANENT_HEADERS"
import checkAccept from "../mediaTypes/checkAccept"
import { Operation } from "./Operation"
export type GetRootParameters = DataRequestHeaders & DataParameters
const BODY = `{"_links":{"contact":{"href":"mailto:keesey+phylopic@gmail.com","title":"Mike Keesey"},"documentation":{"href":"http://api-docs.phylopic.org/v2"},"resources":[{"href":"/autocomplete?build=${BUILD}","title":"Autocomplete for Phylogenetic Nodes"},{"href":"/collections","title":"Entity Collections"},{"href":"/contributors?build=${BUILD}","title":"Image Contributors"},{"href":"/images?build=${BUILD}","title":"Silhouette Images"},{"href":"/licenses?build=${BUILD}","title":"Licenses for New Submissions"},{"href":"/nodes?build=${BUILD}","title":"Phylogenetic Nodes"},{"href":"/ping","title":"API Check"},{"href":"/root?build=${BUILD}","title":"Phylogenetic Root Node"},{"href":"/uploads","title":"Image Submission Uploads"}],"self":{"href":"/?build=${BUILD}"}},"build":${BUILD},"buildTimestamp":${JSON.stringify(
    process.env.PHYLOPIC_BUILD_TIMESTAMP,
)},"title":"PhyloPic Application Programming Interface","version":${JSON.stringify(pkg.version)}}`
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
