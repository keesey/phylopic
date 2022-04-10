import { GetParameterCommand, SSMClient } from "@aws-sdk/client-ssm"
const getBuild = async () => {
    const ssmClient = new SSMClient({})
    let build: number
    try {
        const response = await ssmClient.send(
            new GetParameterCommand({
                Name: "PHYLOPIC_BUILD",
            }),
        )
        if (typeof response.Parameter?.Value !== "string") {
            throw new Error("Invalid build in SSM.")
        }
        build = parseInt(response.Parameter.Value, 10)
        if (!isFinite(build) || build < 0 || Math.floor(build) !== build) {
            throw new Error(
                "Expecred build index to be a positive integer. Found: " +
                    JSON.stringify(response.Parameter.Value) +
                    ".",
            )
        }
    } finally {
        ssmClient.destroy()
    }
    return build
}
export default getBuild
