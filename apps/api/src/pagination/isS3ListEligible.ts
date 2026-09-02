import {
    ContributorListParameters,
    ImageListParameters,
    NodeListParameters,
} from "@phylopic/api-models"

const isTruthyFilter = (value: string | number | boolean | undefined) =>
    value !== undefined && value !== "" && value !== false

export const hasExtraListEmbeds = (
    listQuery: Readonly<Record<string, string | number | boolean | undefined>>,
    validEmbeds: readonly string[],
): boolean =>
    Object.keys(listQuery).some(key => {
        if (!key.startsWith("embed_") || key === "embed_items") {
            return false
        }
        const embed = key.slice("embed_".length)
        return validEmbeds.includes(embed)
    })

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
