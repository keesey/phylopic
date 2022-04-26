import { ImageListParameters } from "phylopic-api-models"
import QueryConfigBuilder from "../../sql/QueryConfigBuilder"
const addFilterToQuery = (params: ImageListParameters, builder: QueryConfigBuilder) => {
    if (params.filter_contributor !== undefined) {
        builder.add("AND image.contributor_uuid=$::uuid", [params.filter_contributor])
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
}
export default addFilterToQuery
