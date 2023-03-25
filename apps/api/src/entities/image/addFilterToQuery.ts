import { ImageListParameters } from "@phylopic/api-models"
import QueryConfigBuilder from "../../sql/QueryConfigBuilder"
const addFilterToQuery = (params: ImageListParameters, builder: QueryConfigBuilder) => {
    if (params.filter_contributor !== undefined) {
        builder.add("AND image.contributor_uuid=$::uuid", [params.filter_contributor])
    }
    if (params.filter_created_after !== undefined) {
        builder.add("AND created>=$::timestamp without time zone", [params.filter_created_after])
    }
    if (params.filter_created_before !== undefined) {
        builder.add("AND created<=$::timestamp without time zone", [params.filter_created_before])
    }
    if (params.filter_license_by !== undefined) {
        builder.add("AND image.license_by=$::bit", [params.filter_license_by === "false" ? 0 : 1])
    }
    if (params.filter_license_nc !== undefined) {
        builder.add("AND image.license_nc=$::bit", [params.filter_license_nc === "false" ? 0 : 1])
    }
    if (params.filter_license_sa !== undefined) {
        builder.add("AND image.license_sa=$::bit", [params.filter_license_sa === "false" ? 0 : 1])
    }
    if (params.filter_modified_after !== undefined) {
        builder.add("AND modified>=$::timestamp without time zone", [params.filter_modified_after])
    }
    if (params.filter_modified_before !== undefined) {
        builder.add("AND modified<=$::timestamp without time zone", [params.filter_modified_before])
    }
    if (params.filter_modifiedFile_after !== undefined) {
        builder.add("AND modified_file>=$::timestamp without time zone", [params.filter_modifiedFile_after])
    }
    if (params.filter_modifiedFile_before !== undefined) {
        builder.add("AND modified_file<=$::timestamp without time zone", [params.filter_modifiedFile_before])
    }
}
export default addFilterToQuery
