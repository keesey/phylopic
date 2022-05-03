import { DataParameters } from "@phylopic/api-models"
import { APIGatewayProxyResult } from "aws-lambda"
import checkBuild from "../build/checkBuild"
import createBuildRedirect from "../build/createBuildRedirect"
import { DataRequestHeaders } from "../headers/requests/DataRequestHeaders"
import DATA_HEADERS from "../headers/responses/DATA_HEADERS"
import PERMANENT_HEADERS from "../headers/responses/PERMANENT_HEADERS"
import checkAccept from "../mediaTypes/checkAccept"
import DATA_MEDIA_TYPE from "../mediaTypes/DATA_MEDIA_TYPE"
import { Operation } from "./Operation"
export type GetLicensesParameters = DataRequestHeaders & DataParameters
const BODY =
    '[{"href":"https://creativecommons.org/publicdomain/zero/1.0/","title":"Creative Commons Zero 1.0 Universal Public Domain Dedication"},{"href":"https://creativecommons.org/publicdomain/mark/1.0/","title":"Creative Commons Public Domain Mark 1.0"},{"href":"https://creativecommons.org/licenses/by/4.0/","title":"Creative Commons Attribution 4.0 International"}]'
const RESULT_200: APIGatewayProxyResult = {
    body: BODY,
    headers: { ...DATA_HEADERS, ...PERMANENT_HEADERS },
    statusCode: 200,
}
export const getLicenses: Operation<GetLicensesParameters> = async ({ accept, ...queryParameters }) => {
    checkAccept(accept, DATA_MEDIA_TYPE)
    if (!queryParameters.build) {
        return createBuildRedirect("/licenses", queryParameters)
    }
    checkBuild(queryParameters.build)
    return RESULT_200
}
export default getLicenses
