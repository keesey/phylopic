import isPositiveInteger from "phylopic-utils/dist/detection/isPositiveInteger"
import APIError from "../errors/APIError"
import NO_STORE_HEADERS from "../headers/responses/NO_STORE_HEADERS"
import PERMANENT_HEADERS from "../headers/responses/PERMANENT_HEADERS"
import BUILD from "./BUILD"
const getDeveloperMessage = (buildStatus: string) =>
    `${buildStatus} \`build\` index. Should be the current build index (${BUILD}). The current value can always be gotten by omitting the \`build\` parameter and following the redirect. Or, see the body of this response.`
const checkBuild = (build: string | undefined, userMessage = "There was a problem with a request for data.") => {
    if (typeof build !== "string") {
        throw new APIError(400, [
            {
                developerMessage: getDeveloperMessage("Invalid"),
                field: "build",
                type: "BAD_REQUEST_PARAMETERS",
                userMessage,
            },
        ])
    }
    const n = parseInt(build, 10)
    if (!isPositiveInteger(n)) {
        throw new APIError(400, [
            {
                developerMessage: getDeveloperMessage("Invalid"),
                field: "build",
                type: "BAD_REQUEST_PARAMETERS",
                userMessage,
            },
        ])
    }
    if (n < BUILD) {
        throw new APIError(
            410,
            [
                {
                    developerMessage: getDeveloperMessage("Outdated"),
                    field: "build",
                    type: "RESOURCE_NOT_FOUND",
                    userMessage,
                },
            ],
            PERMANENT_HEADERS,
        )
    }
    if (n !== BUILD) {
        throw new APIError(
            404,
            [
                {
                    developerMessage: getDeveloperMessage("Unknown or future"),
                    field: "build",
                    type: "RESOURCE_NOT_FOUND",
                    userMessage,
                },
            ],
            NO_STORE_HEADERS,
        )
    }
}
export default checkBuild
