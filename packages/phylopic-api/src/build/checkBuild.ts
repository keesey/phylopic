import APIError from "../errors/APIError"
import BUILD from "./BUILD"
const getDeveloperMessage = (buildStatus: string) =>
    `${buildStatus} \`build\` index. Should be the current build index (${BUILD}). The current value can always be gotten by omitting the parameter and following the redirect. Or, see the body of this response.`
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
    if (!isFinite(n) || n <= 0) {
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
        throw new APIError(410, [
            {
                developerMessage: getDeveloperMessage("Outdated"),
                field: "build",
                type: "RESOURCE_NOT_FOUND",
                userMessage,
            },
        ])
    }
    if (n !== BUILD) {
        throw (
            (new APIError(404, [
                {
                    developerMessage: getDeveloperMessage("Unknown or future"),
                    field: "build",
                    type: "RESOURCE_NOT_FOUND",
                    userMessage,
                },
            ]),
            { "cache-control": "no-cache" })
        )
    }
}
export default checkBuild
