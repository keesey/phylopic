import { isUndefinedOr, isUUID, ValidationFaultCollector } from "@phylopic/utils"
import { CONTRIBUTOR_EMBEDDED_PARAMETERS } from "../constants/CONTRIBUTOR_EMBEDDED_PARAMETERS"
import { ContributorListParameters } from "../types/ContributorListParameters"
import isListParameters from "./isListParameters"
export const isContributorListParameters = (
    x: unknown,
    faultCollector?: ValidationFaultCollector,
): x is ContributorListParameters =>
    isListParameters(CONTRIBUTOR_EMBEDDED_PARAMETERS)(x, faultCollector) &&
    isUndefinedOr(isUUID)((x as ContributorListParameters).filter_collection, faultCollector?.sub("filter_collection"))
export default isContributorListParameters
