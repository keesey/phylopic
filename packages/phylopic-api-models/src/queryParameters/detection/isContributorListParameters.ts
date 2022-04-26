import { ValidationFaultCollector } from "phylopic-utils"
import { CONTRIBUTOR_EMBEDDED_PARAMETERS } from "../constants"
import { ContributorListParameters } from "../types"
import isListParameters from "./isListParameters"
export const isContributorListParameters = (
    x: unknown,
    faultCollector?: ValidationFaultCollector,
): x is ContributorListParameters => isListParameters(CONTRIBUTOR_EMBEDDED_PARAMETERS)(x, faultCollector)
