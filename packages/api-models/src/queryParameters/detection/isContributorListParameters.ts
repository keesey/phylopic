import { isUndefinedOr, isUUIDish, type ValidationFaultCollector } from "@phylopic/utils"
import { CONTRIBUTOR_EMBEDDED_PARAMETERS } from "../constants/CONTRIBUTOR_EMBEDDED_PARAMETERS"
import { type ContributorListParameters } from "../types/ContributorListParameters"
import { isListParameters } from "./isListParameters"
export const isContributorListParameters = (
    x: unknown,
    faultCollector?: ValidationFaultCollector,
): x is ContributorListParameters =>
    isListParameters(CONTRIBUTOR_EMBEDDED_PARAMETERS)(x, faultCollector) &&
    isUndefinedOr(isUUIDish)(
        (x as ContributorListParameters).filter_collection,
        faultCollector?.sub("filter_collection"),
    )
