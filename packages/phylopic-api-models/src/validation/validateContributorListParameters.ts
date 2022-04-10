import { ContributorListParameters } from "../queryParameters"
import { validateListParameters } from "./validateListParameters"
export const validateContributorListParameters = (parameters: ContributorListParameters) => {
    return validateListParameters(parameters, [])
}
export default validateContributorListParameters
