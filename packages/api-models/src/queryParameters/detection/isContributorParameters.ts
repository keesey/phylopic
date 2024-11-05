import { CONTRIBUTOR_EMBEDDED_PARAMETERS } from "../constants/CONTRIBUTOR_EMBEDDED_PARAMETERS"
import { isEntityParameters } from "./isEntityParameters"
export const isContributorParameters = isEntityParameters<{}>(CONTRIBUTOR_EMBEDDED_PARAMETERS)
