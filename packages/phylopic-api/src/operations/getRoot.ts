import { validateNodeParameters } from "phylopic-api-types"
import nodeType from "../entities/node"
import createRedirectHeaders from "../headers/createRedirectHeaders"
import checkValidation from "../validation/checkValidation"
import { Operation } from "./Operation"
export interface GetRootNodeParameters {
    readonly build?: string
    readonly embed?: string
}
export const getRoot: Operation<GetRootNodeParameters> = async ({ build, embed }) => {
    checkValidation(validateNodeParameters({ embed }), `Invalid attempt to load ${nodeType.userLabel} data.`)
    return {
        body: "",
        headers: createRedirectHeaders(
            `/nodes/${process.env.PHYLOPIC_ROOT_UUID}${embed ? `?embed=${encodeURIComponent(embed)}` : ""}`,
        ),
        statusCode: 307,
    }
}
export default getRoot
