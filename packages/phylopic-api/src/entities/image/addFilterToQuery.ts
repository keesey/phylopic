import { ImageListParameters } from "phylopic-api-models/src"
import QueryConfigBuilder from "../../utils/postgres/QueryConfigBuilder"
const addFilterToQuery = (params: ImageListParameters, builder: QueryConfigBuilder) => {
    if (params.contributor !== undefined) {
        builder.add("AND image.contributor=$::uuid", [params.contributor])
    }
    if (params.license_by !== undefined) {
        builder.add("AND image.license_by=$::bit", [params.license_by === "false" ? 0 : 1])
    }
    if (params.license_nc !== undefined) {
        builder.add("AND image.license_nc=$::bit", [params.license_nc === "false" ? 0 : 1])
    }
    if (params.license_sa !== undefined) {
        builder.add("AND image.license_sa=$::bit", [params.license_sa === "false" ? 0 : 1])
    }
}
export default addFilterToQuery
