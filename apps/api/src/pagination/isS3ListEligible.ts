import { ContributorListParameters, ImageListParameters, NodeListParameters } from "@phylopic/api-models"

const isTruthyFilter = (value: string | number | boolean | undefined) =>
    value !== undefined && value !== "" && value !== false

export const isUnfilteredContributorsList = (parameters: ContributorListParameters) =>
    !isTruthyFilter(parameters.filter_collection)

export const isUnfilteredNodesList = (parameters: NodeListParameters) =>
    !isTruthyFilter(parameters.filter_name) && !isTruthyFilter(parameters.filter_collection)

export const isUnfilteredImagesList = (parameters: ImageListParameters) =>
    !isTruthyFilter(parameters.filter_node) &&
    !isTruthyFilter(parameters.filter_clade) &&
    !isTruthyFilter(parameters.filter_name) &&
    !isTruthyFilter(parameters.filter_collection) &&
    !isTruthyFilter(parameters.filter_contributor) &&
    !isTruthyFilter(parameters.filter_license_by) &&
    !isTruthyFilter(parameters.filter_license_nc) &&
    !isTruthyFilter(parameters.filter_license_sa) &&
    !isTruthyFilter(parameters.filter_created_after) &&
    !isTruthyFilter(parameters.filter_created_before) &&
    !isTruthyFilter(parameters.filter_modified_after) &&
    !isTruthyFilter(parameters.filter_modified_before) &&
    !isTruthyFilter(parameters.filter_modifiedFile_after) &&
    !isTruthyFilter(parameters.filter_modifiedFile_before)

export const canServeListFromS3 = (
    listQuery: Readonly<Record<string, string | number | boolean | undefined>>,
    isEligible: (listQuery: Readonly<Record<string, string | number | boolean | undefined>>) => boolean,
): boolean => isEligible(listQuery) && listQuery.embed_items !== "true"
