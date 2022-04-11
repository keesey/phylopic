import { APIGatewayProxyResult } from "aws-lambda"
import BUILD from "../build/BUILD"
import CACHE_PER_BUILD_HEADERS from "../headers/CACHE_PER_BUILD_HEADERS"
import CORS_HEADERS from "../headers/CORS_HEADERS"
import DATA_HEADERS from "../headers/DATA_HEADERS"
import checkAccept from "../mediaTypes/checkAccept"
import DATA_MEDIA_TYPE from "../mediaTypes/DATA_MEDIA_TYPE"
import create304 from "../utils/aws/create304"
import matchesBuildETag from "../build/matchesBuildETag"
import { Operation } from "./Operation"
export interface GetRootParameters {
    readonly accept?: string
    readonly "if-none-match"?: string
}
const BODY = `{"_links":{"contact":{"href":"mailto:keesey+phylopic@gmail.com","title":"Mike Keesey"},"documentation":{"href":"https://api-docs.phylopic.org/versions/2.0"},"resources":[{"href":"/autocomplete?build=${BUILD}","title":"Autocomplete for Phylogenetic Nodes"},{"href":"/contributors?build=${BUILD}","title":"Image Contributors"},{"href":"/images?build=${BUILD}","title":"Silhouette Images"},{"href":"/licenses?build=${BUILD}","title":"Licenses for New Submissions"},{"href":"/nodes?build=${BUILD}","title":"Phylogenetic Nodes"},{"href":"/ping","title":"API Check"},{"href":"/root?build=${BUILD}","title":"Phylogenetic Root Node"}],"self":{"href":"/?build=${BUILD}"}},"build":${JSON.stringify(
    BUILD,
)},"buildTimestamp":${JSON.stringify(
    process.env.PHYLOPIC_BUILD_TIMESTAMP,
)},"title":"PhyloPic Application Programming Interface","version":"2.0.0-alpha"}`
const RESULT_200: APIGatewayProxyResult = {
    body: BODY,
    headers: {
        ...CACHE_PER_BUILD_HEADERS,
        ...CORS_HEADERS,
        ...DATA_HEADERS,
    },
    statusCode: 200,
}
export const getIndex: Operation<GetRootParameters> = async ({ accept, "if-none-match": ifNoneMatch }) => {
    checkAccept(accept, DATA_MEDIA_TYPE)
    if (matchesBuildETag(ifNoneMatch)) {
        return create304()
    }
    return RESULT_200
}
export default getIndex
