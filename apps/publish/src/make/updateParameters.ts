import {
    GetFunctionConfigurationCommand,
    LambdaClient,
    UpdateFunctionConfigurationCommand
} from "@aws-sdk/client-lambda"
import { PutParameterCommand, SSMClient } from "@aws-sdk/client-ssm"
const updateLambdaEnvironmentVariables = async (
    client: LambdaClient,
    FunctionName: string,
    variables: Readonly<Record<string, string>>,
) => {
    const getResult = await client.send(new GetFunctionConfigurationCommand({ FunctionName }))
    if (getResult.Environment?.Error) {
        throw new Error(getResult.Environment.Error.Message)
    }
    await client.send(
        new UpdateFunctionConfigurationCommand({
            FunctionName,
            Environment: {
                Variables: {
                    ...getResult.Environment?.Variables,
                    ...variables,
                },
            },
        }),
    )
}
// :TODO: Implement updating the root
const updateParameters = async (build: number/*, rootUUID: UUID*/) => {
    const ssmClient = new SSMClient({})
    const lambdaClient = new LambdaClient({})
    const buildValue = build.toString(10)
    const buildTimestamp = new Date().toISOString()
    await Promise.all([
        ssmClient.send(
            new PutParameterCommand({
                Name: "PHYLOPIC_BUILD",
                Overwrite: true,
                Value: buildValue,
            }),
        ),
        ssmClient.send(
            new PutParameterCommand({
                Name: "PHYLOPIC_BUILD_TIMESTAMP",
                Overwrite: true,
                Value: buildTimestamp,
            }),
        ),
        /*
        ssmClient.send(
            new PutParameterCommand({
                Name: "PHYLOPIC_ROOT_UUID",
                Overwrite: true,
                Value: rootUUID,
            }),
        ),
        */
        updateLambdaEnvironmentVariables(lambdaClient, "phylopic-api-prod-static", {
            PHYLOPIC_BUILD: buildValue,
            PHYLOPIC_BUILD_TIMESTAMP: buildTimestamp,
            // PHYLOPIC_ROOT_UUID: rootUUID,
        }),
        updateLambdaEnvironmentVariables(lambdaClient, "phylopic-api-prod-dynamic", {
            PHYLOPIC_BUILD: buildValue,
        }),
    ])
    ssmClient.destroy()
    lambdaClient.destroy()
}
export default updateParameters
